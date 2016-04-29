//添加事件
    function addEvent(o,e,f){
        if(window.attachEvent){o.attachEvent("on"+e,f)}else if(window.addEventListener){o.addEventListener(e,f,false);}else{o["on"+e]=f;}
    }
//取消事件
function removeEvent(o,e,f){
    if(window.detachEvent){o.detachEvent("on"+e,f);}else if(window.removeEventListener){o.removeEventListener(e,f,false);}else{o["on"+e]=null;}
}
// class是否存在
function hasClass(obj,sClass){var reg = new RegExp("(^|\\s)" + sClass + "(\\s|$)");return reg.test(obj.className)}
//阻止浏览器的默认行为
function stopDefault(e){if(e&&e.preventDefault){e.preventDefault();}else{window.event.returnValue=false;}return false;}
//阻断事件冒泡
function stopBubble(e){if(e&&e.stopPropagation){e.stopPropagation();}else{window.event.cancelBubble=true;}}
function GetID(s){return document.getElementById(s);}
//创建元素
function creElm(o,pN,t){
    var tmp=document.createElement(t||'div'),p;
    for(p in o){tmp[p]=o[p];}
    return pN?pN.appendChild(tmp):document.body.appendChild(tmp);
}
//计算字符串长度[全角算2长度]
function strLength(str){return str.replace(/[^\x00-\xff]/g,"**").length;}
function SetCss(o,k,s){
    var c=o.className.split(' '),n=0,nCSS='';
    for(var i=0;i<c.length;i++)
    {
        if(c[i]!=k){nCSS+=(nCSS=='')?c[i]:' '+c[i];}
        else{n=1;}
    }
    if(s=='add'){nCSS+=(nCSS=='')?k:' '+k;}
    o.className=nCSS;
}
//自定义验证函数
function testFunction(o){
    var val=o.value,len=Math.floor(strLength(val));
    return {stat:len<50,msg:'已输入<strong>'+len+'</strong>个字符；',msgCss:(len<50?'TestClass_OK':'TestClass_Err'),inCss:null};
}
function ValidatorForm(f,Stat,Validator){
    var vf=this;
    //正则,最小值,最大值,提示消息
    this.Validator={
        email:[/^(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)?$/,0,0,'Email地址填写错误'],
        tel:[/^((0?1[358]\d{9})[,，]?|((0(10|2[0-9]{1}|[3-9]{1}\d{2})[-_－—]?)?\d{7,8})[,，]?)*$/,0,0,'电话号码填写错误'],
        mobile:[/^(0?1[358]\d{9})*$/,0,12,'手机号码填写错误'],
        url:[/^(http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*)?$/,0,0,'网址填写错误'],
        number:[/^\d*$/,0,0,'只能填写数字格式'],
        english:[/^[A-Za-z]*$/,0,0,'只能输入半角英文字母'],
        chinese:[/^[\u0391-\uFFE5]*$/,0,0,'只能输入全角中文'],
        username:[/^[a-zA-Z]{1}\w*$/,4,20,'帐号需由字母开头的4-20位字母、数字或下划线组成'],
        password:[/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]*$/,4,20,'密码长度4-20,请勿输入特殊字符'],
        date:[/^((\d{4})[\-|\.|\/](\d{1,2})[\-|\.|\/](\d{1,2}))?$/,'','','请填写如2012-1-1格式日期！'],
        Compare:[/^[\s\S]*$/,0,0,''],
        length:[/^[\s\S]*$/,0,0,''],
        exec:[/^[a-zA-Z]{1}\w*$/,0,0,'']
    }
    //消息Box样式及框入框样式
    this.Stat={
        tag:'span',     //提示文本标签
        msgNormal:'vf_Normal',  //正常样式
        msgCorrect:'vf_Correct', //正确
        msgError:'vf_Error',  //错误
        msgFocus:'vf_Focus',  //焦点
        inCorrect:'vf_inCorrect', //文本框正确
        inError:'vf_inError',  //错误
        inFocus:'vf_inFocus'  //焦点
    }
    if(Validator){for(var i in this.Validator){this.Validator[i]=Validator[i]!==undefined?Validator[i]:this.Validator[i];}}
    if(Stat){for(var i in this.Stat){this.Stat[i]=Stat[i]!==undefined?Stat[i]:this.Stat[i];}}
    this.Form=f;
    var fn=f.elements.length,i,j,_dataType;
    for(i=0;i<fn;i++){
        _dataType=f.elements[i].getAttribute('dataType');
        _dataType=_dataType?_dataType.split(' '):[];
        for(j=0;j<_dataType.length;j++)
        {
            if(this.Validator[_dataType[j].split('[')[0]]){
                f.elements[i].onblur=(function(o){return function(){vf.CheckData(o);}})(f.elements[i]);
                if(f.elements[i].tagName.toUpperCase()=='TEXTAREA'){
                    f.elements[i].onkeyup=(function(o){
                        return function(){
                            var MsgTag=vf.GetMsgBox(o);
                            MsgTag.innerHTML='已输入<strong>'+Math.floor(strLength(o.value))+'</strong>个字符；';
                        }
                    })(f.elements[i]);
                }
            }
        }
    }
    //提交表单
    this.submit=function(e){
        var fn=vf.Form.elements.length,i,j,_Err=0,_Focus,_Msg='',t,_dataType;
        for(i=0;i<fn;i++){
            _dataType=f.elements[i].getAttribute('dataType');
            _dataType=_dataType?_dataType.split(' '):[];
            for(j=0;j<_dataType.length;j++)
            {
                if(vf.Validator[_dataType[j].split('[')[0]]){
                    t=vf.CheckData(f.elements[i]);
                    if(t&&t[0]==false){
                        _Err++;
                        if(!_Focus){_Focus=f.elements[i];}
                        _Msg+='\n'+f.elements[i].name+' '+t[1];
                        break;
                    }
                }
            }
        }
        if(_Err>0){
            e&&stopDefault(e);
            //_Msg //提示文本不完善，未使用，直接提示错误数量
            alert('共有'+_Err+'项填写错误！');
            _Focus.focus();
        }
    }
    addEvent(f,'submit',vf.submit);
}
ValidatorForm.prototype={
    //验证内容是否正确
    CheckData:function(o){
        var _dataType=o.getAttribute('dataType'),i,s=true,_Msg='',_msgCss,_inCss,_mdt,min,max,_dt;
        _dataType=_dataType?_dataType.split(' '):[];
        for(i=0;s&&i<_dataType.length;i++){
            if(this.Validator[_dataType[i].split('[')[0]]){
                _dt=_dataType[i].split('[')[0];
                //自定义验证函数
                if(_dt=='exec'){
                    _mdt=_dataType[i].match(/^exec\[([a-zA-Z]{1}\w*)\]$/);
//     alert(typeof(eval(_mdt[1])))
                    if(_mdt==null){return false;}
                    try
                    {
                        if(typeof(eval(_mdt[1]))=="function")
                        {
                            /*
                             自定义函数返回json
                             stat:结果[true/false],msg:提示文本,msgCss:样式[className],inCss:输入框样式[className]
                             */
                            var _exec=eval(_mdt[1])(o);
                            s=s&&_exec.stat;
                            var MsgTag=this.GetMsgBox(o);
                            _Msg=_exec.msg||'';
                            if(_exec.msgCss){_msgCss=_exec.msgCss;}
//       if(_mdt.inCss){_inCss=_mdt.inCss;}
                        }
                    }
                    catch(e)
                    {
                        alert('not function');
                        return false;
                    }
                }
                //值对比
                else if(_dt=='Compare'){
                    _mdt=_dataType[i].match(/^Compare\[(=|!=|>|>=|<|<=)([^,]+),?(number|text|date)?\]$/);
                    if(_mdt==null){return false;}
                    //    alert(_mdt);
                    _mdt[2]=(_mdt[2]+'\'').split('\'');
                    if(_mdt[2][1]==''){_mdt[2][1]=_mdt[2][0];}
                    if(!this.Form[_mdt[2][0]]||this.Form[_mdt[2][0]].value==''){return false;}
                    var v2=this.Form[_mdt[2][0]].length>1?this.Form[_mdt[2][0]][0].value:this.Form[_mdt[2][0]].value;
                    s=s&&this.Check_Compare(o.value,_mdt[1],v2,_mdt[3]);
                    //生成提示文本
                    var cc;
                    switch (_mdt[1]){
                        case ">": cc='大于';break;
                        case ">=": cc='大于或等于';break;
                        case "<": cc='小于';break;
                        case "<=": cc='小于或等于';break;
                        case "!=": cc='不一至';break;
                        default: cc='一至';
                    }
                    if(!s){_Msg=(_mdt[1]=='='||_mdt[1]=='!=')?'必须和'+_mdt[2][1]+cc:'必须'+cc+_mdt[2][1];}
                }
                //日期格式验证
                else if(_dt=='date'){
                    _mdt=_dataType[i].match(/^date\[(\d{4}[\-|\.|\/]\d{1,2}[\-|\.|\/]\d{1,2})?,(\d{4}[\-|\.|\/]\d{1,2}[\-|\.|\/]\d{1,2})?\]$/);
                    if(_mdt==null){s=s&&this.Validator[_dt][0].test(o.value);}
                    else{
                        min=_mdt?_mdt[1]:this.Validator[_dt][1];
                        max=_mdt?_mdt[2]:this.Validator[_dt][2];
                        s=s&&this.Validator[_dt][0].test(o.value)&&this.Check_Date(o.value,min,max);
                    }
                }
                //其它类型验证
                else{
                    _mdt=_dataType[i].match(/^([^[]+)\[(\d*),(\d*)\]$/);
                    min=_mdt?_mdt[2]:this.Validator[_dt][1];
                    max=_mdt?_mdt[3]:this.Validator[_dt][2];
                    s=s&&this.Validator[_dt][0].test(o.value);
                    if(s){s=s&&this.Check_Num((_dt=='number'?o.value-0:strLength(o.value)),min,max);}
                    else{_Msg=this.Validator[_dt][3];}
                }
                //生成提示文本
                if(_Msg==''&&!s)
                {
                    if(min||max){
                        if(_dt=='number'){
                            _Msg=min&&max?'只能输入'+min+'-'+max+'范围数字':min?'只能输入大于'+min+'数字':'只能输入小于'+max+'数字';
                        }
                        else if(_dt=='date'){
                            _Msg=min&&max?'只能输入'+min+'至'+max+'范围日期':min?'只能输入大于'+min+'日期':'只能输入小于'+max+'日期';
                        }
                        else{
                            _Msg=min&&max?'需输入'+min+'-'+max+'个有效字符':min?'至少需输入'+min+'个有效字符':'最多只能输入'+max+'个有效字符';
                        }
                    }else{_Msg=this.Validator[_dt][3];}
                }
            }
        }
        if(s){this.AddCorrect(o,{msg:_Msg,msgCss:_msgCss,inCss:_inCss});}else{this.AddError(o,{msg:_Msg,msgCss:_msgCss,inCss:_inCss});}
        return [s,_Msg];
    },
    //验证正确
    AddCorrect:function(o,s){
        var MsgTag=this.GetMsgBox(o);
        MsgTag.innerHTML=s.msg||'';
        this.vfSetCss(MsgTag,s.msgCss||this.Stat.msgCorrect,1);
        this.vfSetCss(o,s.inCss||this.Stat.inCorrect,0);
    },
    //验证错误
    AddError:function(o,s){
        var MsgTag=this.GetMsgBox(o);
        MsgTag.innerHTML=o.getAttribute('msg')||s.msg;
        this.vfSetCss(MsgTag,s.msgCss||this.Stat.msgError,1);
        this.vfSetCss(o,s.inCss||this.Stat.inError,0);
    },
    //获取/创建提示Box
    GetMsgBox:function(o){
        var MsgTag=GetID('vfMsgBox_'+o.name);
        if(!MsgTag){
            MsgTag=o.nextSibling;
            while(MsgTag&&MsgTag.nodeType!=1){MsgTag=MsgTag.nextSibling;}
            if(!MsgTag||MsgTag.tagName.toUpperCase()!=this.Stat.tag.toUpperCase()||!MsgTag.getAttribute('msgbox')){
                MsgTag=creElm({},o.parentNode,this.Stat.tag);
                MsgTag.setAttribute('msgbox','1');
                if(o.nextSibling.nextSibling){o.parentNode.insertBefore(MsgTag,o.nextSibling);}
            }
        }
        return MsgTag;
    },
    //验证值范围
    Check_Num:function(v,min,max){
        v=v||0;
        if(min&&max){return v>=min-0&&v<=max-0;}
        else if(min){return v>=min-0;}
        else if(max){return v<=max-0;}
        return true;
    },
    //值对比
    //值,逻辑运算,对比值,对比类型[number-数字,date-日期,text-文本]
    Check_Compare:function(v,operator,v2,DataType){
        //为空时自动判断格式
        if(!DataType){
            if(this.Validator.number[0].test(v)){DataType='number';}
            else if(this.Validator.date[0].test(v)){DataType='date';}
            else{DataType='text'}
        }
        //数据格式转换
        if(DataType=='number'){v-=0;v2-=0;}
        else if(DataType=='date'){
            var _mdt=v.match(this.Validator.date[0]);
            if(_mdt==null){return false;}
            v=new Date(_mdt[2],_mdt[3]-1,_mdt[4])-new Date;
            _mdt=v2.match(this.Validator.date[0]);
            if(_mdt==null){return false;}
            v2=new Date(_mdt[2],_mdt[3]-1,_mdt[4])-new Date;
        }
        switch (operator){
            case ">": return v>v2;break;
            case ">=": return v>=v2;break;
            case "<": return v<v2;break;
            case "<=": return v<=v2;break;
            case "!=": return v!=v2;break;
            default: return v==v2;
        }
    },
    //日期验证范围
    Check_Date:function(v,min,max){
        var _mdt=v.match(this.Validator.date[0]);
        if(_mdt==null){return false;}
        v=new Date(_mdt[2],_mdt[3]-1,_mdt[4])-new Date;
        _mdt=min.match(this.Validator.date[0]);
        min=_mdt==null?null:new Date(_mdt[2],_mdt[3]-1,_mdt[4])-new Date;
        _mdt=max.match(this.Validator.date[0]);
        max=_mdt==null?null:max=new Date(_mdt[2],_mdt[3]-1,_mdt[4])-new Date;
        return this.Check_Num(v,min,max);
    },
    //设置样式
    vfSetCss:function(o,css,s){
        if(!s){
            SetCss(o,this.Stat.inCorrect,'del');
            SetCss(o,this.Stat.inError,'del');
            SetCss(o,this.Stat.inFocus,'del');
        }
        if(s){o.className=css;}else{SetCss(o,css,'add');}
    }
}
new ValidatorForm(GetID('theForm'));
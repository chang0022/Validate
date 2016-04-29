;(function ($) {

    $.extend({
        options: {
            email: [/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'Email地址填写错误'],
            mobile: [/^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}$/, '手机号码填写错误'],
            number: [/^\d*$/, '只能填写数字格式'],
            idCard: [/^(\d{15}$|^\d{18}$|^\d{17}(X|x))$/, '请输入正确的身份证号码'],
            english: [/^[A-Za-z]*$/, '只能输入半角英文字母'],
            chinese: [/^[\u0391-\uFFE5]*$/, '只能输入全角中文'],
            username: [/^[a-zA-Z]{1}\w*$/, '帐号需由字母开头的4-20位字母、数字或下划线组成'],
            password: [/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]*$/, '密码长度4-20,请勿输入特殊字符'],
            date: [/^((\d{4})[\-|\.|\/](\d{1,2})[\-|\.|\/](\d{1,2}))?$/, '请填写如2012-1-1格式日期！'],
            Compare: [/^[\s\S]*$/, ''],
            length: [/^[\s\S]*$/, ''],
            exec: [/^[a-zA-Z]{1}\w*$/, ''],
            required: ['必填字段']
        },
        methods: {
            required: function (options, value) {
                return ( options && value ) ? true : false;
            },
            email: function (options, value) {
                return options[0].test(value);
            },
            username: function (options, value) {
                return options[0].test(value);
            },
            password: function (options, value) {
                return options[0].test(value);
            },
            number: function (options, value) {
                return options[0].test(value);
            },
            english: function (options, value) {
                return options[0].test(value);
            },
            chinese: function (options, value) {
                return options[0].test(value);
            },
            mobile: function (options, value) {
                return options[0].test(value);
            },
            idCard: function (options, value) {
                return options[0].test(value);
            }
        },
    });

    $.fn.extend({
        Validate: function () {
            var _t = $(this),
                _o = _t.children();
            $.each(_o, function () {
                $(this).focusOut();
                // var data = $(this).checkData();
                // if ( !data.flag ) {
                //     $(this).showError(data.msg[data.msg.length-1]);
                // }
                _t.submitForm($(this));
            });
        },
        strLength: function () {
            var val;
            val = $(this).getValue();
            return val.replace(/[^\x00-\xff]/g, "**").length;
        },
        checkNum: function (min, max) {
            var v;
            v = $(this).strLength() || 0;
            if (min && max) {
                return v >= min - 0 && v <= max - 0;
            }
            else if (min) {
                return v >= min - 0;
            }
            else if (max) {
                return v <= max - 0;
            }
            return true;
        },
        getValue: function () {
            return $.trim($(this).val());
        },
        showError: function (msg) {
            var _type, _direction;
            _type = $(this).hasAttr("data-tips") ? 1 : 0;
            if (_type) {
                _direction = $(this).attr("data-tips") ?  parseInt($(this).attr("data-tips")) : 0;
                if (_direction) {
                    layer.tips(msg, $(this), {
                        tips: _direction
                    })
                } else {
                    layer.tips(msg, $(this));
                }
            } else {
                layer.tips(msg, $(this));
            }
        },
        hasAttr: function (name) {
            return $(this).attr(name) !== undefined;
        },
        keyUp: function () {

        },
        focusOut: function () {
            $(this).blur(function () {
                var data = $(this).checkData();
                if ( !data.flag ) {
                    $(this).showError(data.msg[data.msg.length-1]);
                }
            })
        },
        submitForm: function (Data) {
            var _btn;
            _btn = $(this).children("#submitBtn");
            _btn.on("click", function (e) {
                var data;
                data = Data.checkData();
                if (!data.flag) {
                    e.preventDefault();
                    var _error = "有错误。请检查表单，再提交。";
                    layer.msg(_error);
                }
            });
        },
        checkData: function () {
            var _this = $(this),
                Flag = true,
                error = [],
                val,
                _type, _min, _max, _error;
            _type = _this.attr("data-type") ? _this.attr("data-type").toLowerCase() : 0;
            _min = _this.attr("minlength") ? parseInt(_this.attr("minlength")) : 0;
            _max = _this.attr("maxlength") ? parseInt(_this.attr("maxlength")) : 0;
            _required = _this.hasAttr("required") ? 1 : 0;
            val = _this.getValue();
            if (_type) {
                if (!$.methods[_type]($.options[_type], val)) {
                    Flag = false;
                    error.push($.options[_type][1]);
                }
            }
            if (_min || _max) {
                if (!_this.checkNum(_min, _max)) {
                    _error = _min && _max ? '需输入' + _min + '-' + _max + '个有效字符' : _min ? '至少需输入' + _min + '个有效字符' : '最多只能输入' + _max + '个有效字符';
                    Flag = false;
                    error.push(_error);
                }
            }
            if (_required) {
                if (!$.methods.required(_required, val)) {
                    Flag = false;
                    error.push($.options.required[0]);
                }
            }
            return {
                flag: Flag,
                msg: error
            };
        },
    })
})(jQuery);
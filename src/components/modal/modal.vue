<template>
    <div :class="maskClasses" v-show="visible" @click="mask" transition="fade"></div>
    <div :class="wrapClasses" @click="handleWrapClick">
        <div :class="classes" :style="styles" v-show="visible" transition="ease">
            <div :class="[prefixCls + '-content']">
                <template v-if="closeTpl">
                    <a :class="[prefixCls + '-close']" v-el:close-tpl>
                        {{{closeTpl}}}
                    </a>
                </template>
                <template v-if="!closeTpl">
                    <a :class="[prefixCls + '-close']" v-if="closable" @click="close">
                        <slot name="close" >
                            <Icon type="ios-close-empty"></Icon>
                        </slot>
                    </a>
                </template>
                <div :class="[prefixCls + '-header']" v-if="showHead" v-el:header>
                    <template v-if="header">
                        {{{header}}}
                    </template>
                    <template v-if="!header">
                        <slot name="header">
                            <div :class="[prefixCls + '-header-inner']">{{ title }}</div>
                        </slot>
                    </template>
                </div>
                <div :class="[prefixCls + '-body']">
                    <slot></slot>
                </div>
                <div :class="[prefixCls + '-footer']" v-if="!footerHide" v-el:footer>
                    <template v-if="footer">
                        {{{footer}}}
                    </template>
                    <template v-if="!footer">
                        <slot name="footer">
                            <i-button type="text" size="large" @click="cancel">{{ cancelText }}</i-button>
                            <i-button type="primary" size="large" :loading="buttonLoading" @click="ok">{{ okText }}
                            </i-button>
                        </slot>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Icon from '../icon';
    import iButton from '../button/button.vue';
    import {getScrollBarSize} from '../../utils/assist';
    import {t} from '../../locale';

    const prefixCls = 'ivu-modal';

    export default {
        components: {Icon, iButton},
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            closable: {
                type: Boolean,
                default: true
            },
            maskClosable: {
                type: Boolean,
                default: true
            },
            title: {
                type: String
            },
            width: {
                type: [Number, String],
                default: 520
            },
            okText: {
                type: String,
                default () {
                    return t('i.modal.okText');
                }
            },
            cancelText: {
                type: String,
                default () {
                    return t('i.modal.cancelText');
                }
            },
            loading: {
                type: Boolean,
                default: false
            },
            style: {
                type: Object
            },
            className: {
                type: String
            },
            // for instance
            footerHide: {
                type: Boolean,
                default: false
            },
            scrollable: {
                type: Boolean,
                default: false
            },
            header: String,
            footer: String,
            closeTpl:String
        },
        data () {
            return {
                prefixCls: prefixCls,
                wrapShow: false,
                showHead: true,
                buttonLoading: false
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}-wrap`,
                    {
                        [`${prefixCls}-hidden`]: !this.wrapShow,
                        [`${this.className}`]: !!this.className
                    }
                ];
            },
            maskClasses () {
                return `${prefixCls}-mask`;
            },
            classes () {
                return `${prefixCls}`;
            },
            styles () {
                let style = {};

                const styleWidth = {
                    width: `${this.width}px`
                };

                const customStyle = this.style ? this.style : {};

                Object.assign(style, styleWidth, customStyle);

                return style;
            }
        },
        methods: {
            close () {
                this.visible = false;
                this.$emit('on-cancel');
            },
            mask () {
                if (this.maskClosable) {
                    this.close();
                }
            },
            handleWrapClick (event) {
                // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
                const className = event.target.getAttribute('class');
                if (className && className.indexOf(`${prefixCls}-wrap`) > -1) this.mask();
            },
            cancel () {
                this.close();
            },
            ok () {
                if (this.loading) {
                    this.buttonLoading = true;
                } else {
                    this.visible = false;
                }
                this.$emit('on-ok');
            },
            EscClose (e) {
                if (this.visible && this.closable) {
                    if (e.keyCode === 27) {
                        this.close();
                    }
                }
            },
            checkScrollBar () {
                let fullWindowWidth = window.innerWidth;
                if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                    const documentElementRect = document.documentElement.getBoundingClientRect();
                    fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
                }
                this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
                if (this.bodyIsOverflowing) {
                    this.scrollBarWidth = getScrollBarSize();
                }
            },
            setScrollBar () {
                if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
                    document.body.style.paddingRight = `${this.scrollBarWidth}px`;
                }
            },
            resetScrollBar () {
                document.body.style.paddingRight = '';
            },
            addScrollEffect () {
                this.checkScrollBar();
                this.setScrollBar();
                document.body.style.overflow = 'hidden';
            },
            removeScrollEffect() {
                document.body.style.overflow = '';
                this.resetScrollBar();
            }
        },
        ready () {
            if (this.visible) {
                this.wrapShow = true;
            }

            let showHead = true;

            if (this.$els.header.innerHTML.replace(/(^\s*)|(\s*$)/g, "") == `<div class="${prefixCls}-header-inner"></div>` && !this.title) {
                showHead = false;
            }

            this.showHead = showHead;

            // ESC close
            document.addEventListener('keydown', this.EscClose);
            if(this.header){
                this.$children[0].$compile(this.$els.header)
            }
            if(this.footer){
                this.$children[0].$compile(this.$els.footer)
            }
            if(this.closeTpl){
                this.$children[0].$compile(this.$els.closeTpl)
            }

            if (!this.scrollable) {
                this.addScrollEffect();
            }
        },
        beforeDestroy () {
            document.removeEventListener('keydown', this.EscClose);
            this.removeScrollEffect();
        },
        watch: {
            visible (val) {
                if (val === false) {
                    this.buttonLoading = false;
                    this.timer = setTimeout(() => {
                        this.wrapShow = false;
                        this.removeScrollEffect();
                    }, 300);
                } else {
                    if (this.timer) clearTimeout(this.timer);
                    this.wrapShow = true;
                    if (!this.scrollable) {
                        this.addScrollEffect();
                    }
                }
            },
            loading (val) {
                if (!val) {
                    this.buttonLoading = false;
                }
            },
            scrollable (val) {
                if (!val) {
                    this.addScrollEffect();
                } else {
                    this.removeScrollEffect();
                }
            }
        }
    };
</script>

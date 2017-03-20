<template>
    <div>
        <Menu mode="horizontal" theme="light" active-key="1" style="height:40px; line-height:40px">
            <Submenu key="2">
                <template slot="title">
                    <Icon type="edit"></Icon>
                    编辑
                </template>
                <Menu-item key="2-0" @click="delCol">
                    <Icon type="android-delete"></Icon>
                    删除
                </Menu-item>
                <Menu-group title="创建">
                    <Menu-item key="2-1" @click="createRow('up')">创建行（上）</Menu-item>
                    <Menu-item key="2-2" @click="createRow('down')">创建行（下）</Menu-item>
                    <Menu-item key="2-3" @click="createCol('left')">创建列（左）</Menu-item>
                    <Menu-item key="2-4" @click="createCol('right')">创建列（右）</Menu-item>
                </Menu-group>
                <Menu-group title="移动">
                    <Menu-item key="2-15" @click="moveRow('up')">行上移</Menu-item>
                    <Menu-item key="2-16" @click="moveRow('down')">行下移</Menu-item>
                    <Menu-item key="2-17">列左移</Menu-item>
                    <Menu-item key="2-18">列右移</Menu-item>
                </Menu-group>
            </Submenu>
            <Menu-item key="3" @click="saveLayout">
                <Icon type="ios-cloud-upload-outline"></Icon>
                保存
            </Menu-item>
        </Menu>
        <Card :dis-hover="true" class="top-menu-card" style="margin-top: 4px;">
            <Tag type="border" @click="clearSelected()" title="清除选中，查看效果">
                <Icon type="android-navigate" style="transform: rotate(-45deg);"></Icon>
            </Tag>
            <Tag type="border" @click="createRow('up')" title="创建行（上）">
                <Icon type="plus-round"></Icon>
                <Icon type="chevron-up"></Icon>
            </Tag>
            <Tag type="border" @click="createRow('down')" title="创建行（下）">
                <Icon type="plus-round"></Icon>
                <Icon type="chevron-down"></Icon>
            </Tag>
            <Tag type="border" @click="createCol('left')" title="创建列（左）">
                <Icon type="plus-round"></Icon>
                <Icon type="chevron-left"></Icon>
            </Tag>
            <Tag type="border" @click="createCol('right')" title="创建列（右）">
                <Icon type="plus-round"></Icon>
                <Icon type="chevron-right"></Icon>
            </Tag>
            <Tag type="border" @click="moveRow('up')" title="上移动行">
                <Icon type="chevron-up"></Icon>
            </Tag>
            <Tag type="border" @click="moveRow('down')" title="下移动行">
                <Icon type="chevron-down"></Icon>
            </Tag>
            <Tag type="border" @click="moveCol('left')" title="左移动列">
                <Icon type="chevron-left"></Icon>
            </Tag>
            <Tag type="border" @click="moveCol('right')" title="右移动列">
                <Icon type="chevron-right"></Icon>
            </Tag>
            <Tag type="border" @click="delCol" title="删除">
                <Icon type="android-delete"></Icon>
            </Tag>
        </Card>
    </div>
</template>
<script>
    export default {
        props: {
            options: {
                type: Object, default: () => {
                }
            },
            events: {
                type: Object, default: () => {
                }
            },
            mock: Boolean
        },

        created(){
            if (this.mock && this.$options.mock) {
                if (this.$options.mock.options) {
                    this.options = this.$options.mock.options
                }

                if (this.$options.mock.events) {
                    this.events = this.$options.mock.events
                }
            }
            var events = _.keys(this.events)

            events.forEach((event) => {
                this.$on(event, this.events[event])
            })
        },

        methods: {
            createRow(arrow){
                this.$emit('on-create-row', arrow)
            },

            createCol(arrow){
                this.$emit('on-create-col', arrow)
            },

            moveCol(arrow){
                this.$emit('on-move-col', arrow)
            },

            moveRow(arrow){
                this.$emit('on-move-row', arrow)
            },

            delCol(){
                this.$emit('on-del-col')
            },

            clearSelected(){
                this.$emit('on-clear-selected')
            },

            exportLayout(){
                this.$emit('on-export')
            },

            saveLayout(){
                this.$emit('on-save')
            }
        }
    }
</script>
<style>
    .top-menu-card .ivu-card-body {
        padding: 6px;
        user-select: none;
    }

    .top-menu-card .ivu-card-body i {
        cursor: pointer;
    }
</style>

<template>
	<view style="background-color: #EAEDF1;">
		<u-card title="请假申请表">
			<view slot="body">
				<u-form :model="form" ref="uForm">
					<u-form-item label="请假日期" label-width="100px">
						<u-input v-model="form.date" placeholder="请选择请假日期" @focus="show = true" />
						<u-calendar v-model="show" :mode="'date'" @change="pick_date"
							:min-date='get_date_format(new Date())' max-date="2099-01-01"></u-calendar>
					</u-form-item>
					<u-form-item label="请假类型" label-width="100px">
						<u-input v-model="form.leave_type" placeholder="请选择请假类型" type="select"
							@click="leave_type_show=true" />
						<u-action-sheet :list="actionSheetList" v-model="leave_type_show"
							@click="actionSheetCallback"></u-action-sheet>
					</u-form-item>
					<u-form-item label="请假原因" label-width="100px" v-if="!form.textarea.length">
						<u-input v-model="form.reason" placeholder="请输入请假原因" type="text" @blur="blur"
							:disabled="!form.leave_type.length" />
					</u-form-item>
					<u-form-item label="请假书" label-width="100px" v-else>
						<u-input v-model="form.textarea" placeholder="请输入请假原因" type="textarea" />
					</u-form-item>
				</u-form>
				<u-button type="primary" @click="add_leaves_event" :disabled="!form.textarea.length">提交请假申请</u-button>
			</view>
		</u-card>
		<u-mask :show="loading"
			style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
			<u-loading :show="loading" size="60"></u-loading>
			<br />
			<text>正在加载请假书...</text>
		</u-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					date: "",
					leave_type: "",
					reason: "",
					textarea: "",
					file_url: ""
				},
				show: false,
				actionSheetList: [{
					text: "病假"
				}, {
					text: "事假"
				}],
				leave_type_show: false,
				loading: false
			}
		},
		methods: {
			pick_date(e) {
				console.log(e);
				this.form.date = e.result
			},
			get_date_format(date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			actionSheetCallback(index) {
				this.form.leave_type = this.actionSheetList[index].text;
			},
			blur() {
				if (!this.form.reason.length) {
					ElNotification({
						title: '错误',
						message: "请假原因不能为空",
						position: 'bottom-right',
						type: "error",
						offset: 50
					})
					return
				}
				this.loading = true
				this.$u.get(
						`/api/textmaker/makerLeavesContentFromResion?resion=${this.form.reason}&type=${this.form.type}`)
					.then(res => {
						console.log(res)
						this.form.textarea = res.data
						this.loading = false
					}).catch(error => {
						console.log(error);
						this.loading = false
					})
			},
			add_leaves_event() {
				this.$u.post('/api/leaves/studentcreateleaves',{
					"leave_type": this.form.leave_type,
					"date": this.form.date,
					"reason": this.form.textarea,
					"file_url": this.form.file_url,
				}).then(res => {
					console.log(res)
					uni.showToast({
						title: '提交成功'
					});
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/mypages/home/index'
						})
					}, 1000);
				}).catch(err => {
					console.log(err);
					ElNotification({
						title: '错误',
						message: "申请失败请重试",
						position: 'bottom-right',
						type: "error",
						offset: 50
					})
				})
			},
		}
	}
</script>

<style>

</style>
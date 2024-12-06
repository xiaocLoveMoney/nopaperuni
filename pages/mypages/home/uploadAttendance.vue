<template>
	<view  style="background-color: #EAEDF1;">
		<u-card title="提交考勤单">
			<view slot="body">
				<u-collapse>
					<u-collapse-item v-for="(item, index) in attendance_form" :key="index" :title="item.student_name">
						<u-radio-group v-model="item.status">
							<u-radio v-for="(e, indexa) in list" :key="indexa" :name="e.name">
								{{e.name}}
							</u-radio>
						</u-radio-group>
					</u-collapse-item>
				</u-collapse>
			</view>
		</u-card>
		<br />
		<br />
		<view style="position: fixed;left: 5%; right: 5%;bottom: 15px;">
			<u-button type="primary" @click="add_attendance_event">提交申请</u-button>
		</view>
		<u-mask :show="loading"
			style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
			<u-loading :show="loading" size="60"></u-loading>
			<br />
			<text style="color: white;">正在提交...</text>
		</u-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				attendance_form: [],
				loading: false,
				list: [{
						name: '正常到校',
						disabled: false
					},
					{
						name: '病假',
						disabled: false
					},
					{
						name: '事假',
						disabled: false
					},
					{
						name: '迟到',
						disabled: false
					},
					{
						name: '早退',
						disabled: false
					}
				],
			}
		},
		methods: {
			get_local_date() {
				const date = new Date();
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			getData() {
				this.$u.get("/api/attendance/getstudent").then(res => {
					console.log(res)
					this.students = res.data
					var current_date = this.get_local_date()
					this.$u.get(`/api/leaves/leaveslistfromdate?date=${current_date}`).then(res => {
						console.log("leaveslistfromdate", res)
						this.todayleaves = res.data
						this.attendance_form = this.students.map(item => {
							var status = '正常到校'
							var date = this.get_local_date()
							var reason = null

							var idx = res.data.filter(item => item.status == '批准').findIndex(e => e
								.user_id == item.user_id)
							if (idx != -1) {
								status = this.todayleaves[idx].leave_type
								reason = this.todayleaves[idx].reason
							}
							return {
								student_id: item.user_id,
								status: status,
								date: date,
								reason: reason,
								student_name: item.username
							}
						})
						console.log("attendance_form", this.attendance_form)
					}).catch(error => {
						console.log(error);
					})
				}).catch(error => {
					console.log(error);
				})
			},
			async add_attendance_event() {
				console.log(this.attendance_form);
				this.loading = true
				for await (const item of this.attendance_form) {
					console.log({
						user_id: item.student_id,
						status: item.status,
						date: item.date,
						reason: item.reason,
					})
					const result = await this.$u.post('/api/attendance/addattendance',{
						user_id: item.student_id,
						status: item.status,
						date: item.date,
						reason: item.reason || '',
					})
					console.log(result)
				}
				this.loading = false
				uni.showToast({
					title: '提交成功'
				});
				setTimeout(function() {
					uni.reLaunch({
						url: '/pages/mypages/home/index'
					})
				}, 1000)
			},
		},
		onLoad() {
			this.getData()
		}
	}
</script>

<style>

</style>
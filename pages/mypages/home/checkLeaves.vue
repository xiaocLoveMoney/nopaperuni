<template>
	<view style="background-color: #EAEDF1;">
		<u-card :title="item.stu_name" v-for="(item,index) in add_checkleaves_form" :key="index">
			<view slot="body">
				<h4>请假原因</h4>
				<text>{{item.reason}}</text>
				<h4>大数据决策建议</h4>
				<u-button v-if="!item.idea.length" class="u-m-t-15" type="primary" paint size="mini"
					@click="add_checkleaves_textmaker_user(item)">获取建议</u-button>
				<text v-else>{{item.idea}}</text>
				<h4 class="u-m-t-15">审批决定</h4>
				<u-radio-group v-model="item.status">
					<u-radio v-for="(e, indexa) in list" :key="indexa" :name="e.name">
						{{e.name}}
					</u-radio>
				</u-radio-group>
			</view>
		</u-card>
		<u-card title="班级管理决策建议">
			<view slot="body">
				<h4>大数据决策建议</h4>
				<text>{{add_checkleaves_allidea || "加载中..."}}</text>
			</view>
		</u-card>
		<u-mask :show="loading"
			style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
			<u-loading :show="loading" size="60"></u-loading>
			<br />
			<text style="color: white;">加载中...</text>
		</u-mask>
		<view style="position: fixed;left: 5%; right: 5%;bottom: 15px;">
			<u-button type="primary" @click="add_checkleaves_event">提交审批</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				add_checkleaves_form: [],
				add_checkleaves_allidea: "",
				loading: false,
				list: [{
						name: '未审核',
						disabled: false
					},
					{
						name: '批准',
						disabled: false
					},
					{
						name: '拒批',
						disabled: false
					},
				],
			}
		},
		methods: {
			getData() {
				this.$u.get("/api/leaves/leaveslist").then(res => {
					console.log(res)
					this.add_checkleaves_form = res.data.filter(item => item.status == '未审核').map(item => {
						return {
							stu_name: item.username,
							reason: item.reason,
							stu_phone: item.phone,
							parent_phones: item.parent_phones,
							parent_emails: item.parent_emails,
							date: item.date,
							status: item.status,
							leave_id: item.leave_id,
							idea: "",
							user_id: item.user_id,
						}
					})
					console.log(this.add_checkleaves_form)
				})
				this.$u.get("/api/analysis/leaveserrorfromclassordepartment").then(res => {
					console.log(res)
					this.add_checkleaves_allidea = res.data
				})
			},
			async add_checkleaves_textmaker_user(item) {
				console.log(item)
				this.loading = true
				let res = await this.$u.get(`/api/analysis/leaveserrorfromuserid?user_id=${item.user_id}`)
				this.loading = false
				item.idea += res.data;

			},
			async add_checkleaves_event() {
				console.log(this.add_checkleaves_form)
				var idx = this.add_checkleaves_form.findIndex(item => item.status == "未审核")
				console.log(idx)
				if (idx != -1) {
					uni.showToast({
						title: '请审核全部内容',
						icon: "error"
					});
					return;
				}
				this.loading = true
				for await (const item of this.add_checkleaves_form) {
					console.log(item)
					var result = await this.$u.put( "/api/leaves/checkleaves", {
						"leave_id": item.leave_id,
						"status": item.status,
					})
					if (result.code != 200) {
						uni.showToast({
							title: '内部错误',
							icon: "error"
						});
					}
				}
				this.loading = false
				uni.showToast({
					title: '操作成功'
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
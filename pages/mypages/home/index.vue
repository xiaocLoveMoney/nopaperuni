<template>
	<view style="background-color: #EAEDF1;">
		<scroll-view @scroll="handleScroll" style="height: 100vh;" scroll-y>
			<view style="height: 20vh; background: linear-gradient(#64ace6, #EAEDF1);
						border-radius: 0 0 15px 15px; 
						position: fixed; top: 0px; width: 100%; z-index: -1;" />
			<view style="margin: 5%;" :style="'opacity:' + opacity">
				<u-swiper :list="swiper" :effect3d=true bg-color="#00000000" height="300"
					img-mode="scaleToFill"></u-swiper>
				<u-notice-bar mode="vertical" :list="announcement" class="u-m-t-5" :more-icon="true"></u-notice-bar>
			</view>

			<u-card :title="'功能模块'">
				<view slot="body">
					<u-row>
						<u-col span="4" class="icon u-text-center"
							@click="switch_btn('/pages/mypages/home/createLeaves')">
							<view class="moudle-cell">
								<u-icon name="edit-pen" :size="60"></u-icon>
								<view>请假申请</view>
							</view>
						</u-col>
						<u-col span="4" style="text-align: center;" class="icon"
							@click="switch_btn('/pages/mypages/home/uploadAttendance')">
							<view class="moudle-cell">
								<u-icon name="clock" :size="60"></u-icon>
								<view>提交考勤</view>
							</view>
						</u-col>
						<u-col span="4" style="text-align: center;" class="icon"
							@click="switch_btn('/pages/mypages/home/checkLeaves')">
							<view class="moudle-cell">
								<u-icon name="checkmark" :size="60"></u-icon>
								<view>请假审批</view>
							</view>
						</u-col>
					</u-row>
				</view>
			</u-card>

			<u-card :title="'个人基本信息'">
				<view slot="body">
					<u-row>
						<u-col span="6" class="info-vertical">
							<text class="info-title">姓名</text>
							<br />
							<text>{{info.stu_name}}</text>
						</u-col>
						<u-col span="6" class="info-vertical">
							<text class="info-title">学籍号</text>
							<br />
							<text>{{info.stu_id || "暂无"}}</text>
						</u-col>
						<u-col span="6" class="info-vertical">
							<text class="info-title">班级</text>
							<br />
							<text>{{info.class_name}}</text>
						</u-col>
						<u-col span="6" class="info-vertical">
							<text class="info-title">系部</text>
							<br />
							<text>{{info.department_name}}</text>
						</u-col>
						<u-col span="6" class="info-vertical">
							<text class="info-title">手机号</text>
							<br />
							<text>{{info.phone}}</text>
						</u-col>
						<u-col span="6" class="info-vertical">
							<text class="info-title">标签</text>
							<br />
							<u-tag :text="item" type="success" v-for="(item,index) in info.role_names" :key="index" />
						</u-col>
					</u-row>
				</view>
			</u-card>
			<u-card title="请假申请记录">
				<view slot='body'>
					<u-table>
						<u-sticky>
							<u-tr>
								<u-th class="table_td">日期</u-th>
								<u-th class="table_td">姓名</u-th>
								<u-th class="table_td">请假原因</u-th>
								<u-th class="table_td">状态标签</u-th>
							</u-tr>
						</u-sticky>
						<u-tr v-for="(item,index) in leaves_tableData" :key="index">
							<u-td class="table_td">{{item.date}}</u-td>
							<u-td class="table_td">{{item.name}}</u-td>
							<u-td class="table_td">{{item.reason}}</u-td>
							<u-td class="table_td">
								<u-tag :text="item.tag" :size="'default'"></u-tag>
							</u-td>
						</u-tr>
					</u-table>
				</view>
			</u-card>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				opacity: "",
				swiper: [],
				announcement: [],
				ip: "",
				info: {},
				leaves_tableData: []
			}
		},
		methods: {
			handleScroll(e) {
				// 获取滚动距离
				const scrollY = e.detail.scrollTop;
				this.opacity = Math.max(1 - scrollY / 200, 0);
			},
			getdata() {
				console.log(this.info);
				this.$u.get("/api/other/swiperlist").then(res => {
					console.log(res);
					this.swiper = res.data.map(item => this.ip + item.swiper_url)
				})
				this.$u.get("/api/announcement/announcementlist").then(res => {
					console.log(res);
					this.announcement = res.data.map(item => item.title)
				})
				this.get_leaveslist()
			},
			get_leaveslist() {
				this.$u.get("/api/leaves/leaveslist").then(res => {
					console.log(res)
					res.data.forEach(item => {
						this.leaves_tableData.push({
							leave_id: item.leave_id,
							date: item.date,
							name: item.username,
							reason: item.leave_type,
							tag: item.status
						})
					})
					this.leaves_tableData = this.leaves_tableData.sort((a, b) => new Date(b.date) - new Date(a
						.date))
				}).catch(err => {
					console.log(err)
				})
				this.leaveslist_page += 1;
			},
			get_date_format(date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			async switch_btn(path) {
				console.log(path);
				console.log(this.info);
				const index = this.info.role_names.includes('学生')
				console.log(index);
				if (index && path == "/pages/mypages/home/createLeaves") {
					setTimeout(function() {
						uni.navigateTo({
							url: path
						})
					}, 500);
				} else if (!index && path != "/pages/mypages/home/createLeaves") {
					if (path == '/pages/mypages/home/uploadAttendance') {
						this.$u.get(`/api/analysis/tablehelper1?date=${this.get_date_format(new Date())}`).then(
							res => {
								uni.showToast({
									title: '已提交,请勿重复'
								});
							}).catch(err => {
							setTimeout(function() {
								uni.navigateTo({
									url: path
								})
							}, 500);
						})
						// console.log(result);

					} else {
						setTimeout(function() {
							uni.navigateTo({
								url: path
							})
						}, 500);
					}

				} else {
					uni.showToast({
						title: '权限不足',
						icon: "error"
					});
				}
			}
		},
		created() {
			// 监听滚动事件
			window.addEventListener("scroll", this.handleScroll)
		},
		// mounted() {
		// 	// 监听滚动事件
		// 	window.addEventListener("scroll", this.handleScroll);
		// },
		onLoad() {
			this.ip = uni.getStorageSync("ip")
			this.info = JSON.parse(uni.getStorageSync("info"))
			this.getdata()
		}
	}
</script>

<style>
	.moudle-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.info-title {
		font-size: 22;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.info-vertical {
		margin-bottom: 10px;
	}

	.table_td {
		height: 40px;
	}

	.icon {
		transition: 0.3s all;


	}

	.icon:active {
		transform: scale(0.7);
	}

	@keyframes breathe {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(.2);
		}
	}
</style>
<template>
	<view  style="background-color: #EAEDF1;">
<!-- 		<view
			style="margin-top: 40px;height: 40vh; background: linear-gradient(#64ace6, #EAEDF1);position: fixed; top: 0px; width: 100%; z-index: -1; left: 0; right: 0;" /> -->

		<view style="margin: 7%; margin-top: 20%; display: flex; justify-content: space-between; align-items: center;">
			<view style="display: flex; align-items: center;">
				<u-image width="55px" height="55px" border-radius='15' :src="ip + info.avatar" />
				<span style="font-weight: bold; margin-left: 15px">{{ info.username }}</span>
			</view>
			<view style="display: flex; align-items: center;">
				<u-icon name="scan" :size="30"></u-icon>
				<u-icon name="arrow-right" :size="30"></u-icon>
			</view>
		</view>

		<u-card style="margin: 5%;" :title="'个人信息'">
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

				</u-row>
			</view>
		</u-card>
		<u-card style="margin: 5%;" :title="'绑定信息'">
			<view slot="body">
				<u-row>
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
		<view style="margin: 5%;">
			<u-cell-group>
				<u-cell-item icon="setting-fill" title="个人设置" @click="switch_btn('/pages/mypages/my/settings')"></u-cell-item>
				<u-cell-item icon="reload" title="修改密码" @click="switch_btn('/pages/mypages/my/resetpwd')"></u-cell-item>
			</u-cell-group>
			<br />
			<u-button type="primary" @click="logout" shape="circle">退出登录</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ip: "",
				info: ""
			}
		},
		methods: {
			switch_btn(path) {
				uni.navigateTo({
					url: path,
				});
			},
			logout() {
				this.$u.get("/api/auth/logout").then(res => {
					uni.reLaunch({
						url:"/pages/mypages/home/login"
					})
				})
			}
		},
		onLoad() {
			this.info = JSON.parse(uni.getStorageSync("info"))
			this.ip = uni.getStorageSync("ip")
		}
	}
</script>

<style>
	.info-title {
		font-size: 22;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.info-vertical {
		margin-bottom: 10px;
		/* display: flex;
		flex-direction: column;
		justify-content: left;
		align-items: left; */
	}

	.table_td {
		height: 40px;
	}

	.icon {
		transition: 0.3s all;

		&:active {
			transform: scale(0.7);
		}
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
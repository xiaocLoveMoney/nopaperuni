<template>
	<view class="back-cell" style="height: 100vh;">
		<view style="color: white; padding-left: 8%; padding-top: 26vh">
			<h2>欢迎使用</h2>
			<h3>无纸化请假系统</h3>
		</view>
		<view class="box-form" style="padding: 10%;">
			<h3 style="color: #4a9e97; padding-bottom: 10%; text-align: center">登录</h3>
			<u-form>
				<u-form-item label="用户名" label-width="80px"><u-input v-model="username" /></u-form-item>
				<u-form-item label="密码" label-width="80px"><u-input v-model="password" type="password" /></u-form-item>
			</u-form>
			<h5 style="text-align: right;color: #4a9e97; margin-bottom: 5%">忘记密码？</h5>
			<u-button type="primary" shape="circle" :ripple="true" @click="login">登录</u-button>
			<!-- <el-button type="primary" style="width: 100%" @click="login">登录</el-button> -->
			<h5 style="text-align: center;color: #4a9e97; margin: 5%">没有账户？现在就去注册！</h5>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ip: "",
				username: "",
				password: ""
			}
		},
		methods: {
			getData() {
				console.log("Hello xiaoc!")
				console.log(uni.getStorageSync("ip"));
			},
			login() {
				this.$u.post("/api/auth/login", {
					username: this.username,
					password: this.password
				}).then(res => {
					console.log(res);
					uni.setStorage({
						key: "token",
						data: res.token
					})
					// localStorage.setItem("token", res.token)
					this.$u.get("/api/auth/info").then(res => {
						console.log(res);
						uni.setStorage({
							key: "info",
							data: JSON.stringify(res.data)
						})

						uni.showToast({
							title: '登录成功',
						});
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/mypages/home/index'
							})
						}, 1500);
					})
				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: '用户名或密码错误',
						icon: 'error'
					});
				})
				// login({
				// 	username: this.username,
				// 	password: this.password,
				// }).then(res => {
				// 	console.log(res);
				// 	// localStorage.setItem("token", res.token);
				// 	uni.setStorage({
				// 		key: "token",
				// 		data: res.token
				// 	})
				// 	info().then(res => {
				// 		console.log(res);
				// 		// localStorage.setItem("info", JSON.stringify(res.data));

				// 		uni.setStorage({
				// 			key: "info",
				// 			data: res.data
				// 		})
				// 		ElMessage({
				// 			type: "success",
				// 			message: "登录成功"
				// 		})
				// 		setTimeout(function() {
				// 			//跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
				// 			uni.switchTab({
				// 				url: '/pages/home/index'
				// 			})
				// 		}, 1500)
				// 	})
				// }).catch(err => {
				// 	console.log(err);
				// 	ElMessage({
				// 		message: "用户名错误或密码错误",
				// 		type: "error"
				// 	})
				// })
			}
		},
		onLoad() {
			this.getData()
		}
	}
</script>

<style>
	.back-cell {
		background: linear-gradient(.6turn, #64d3e6, #9198e5);
		width: 100%;
		height: 100vh;
	}

	.box-form {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 60vh;
		background-color: white;
		border-radius: 25% 25% 0 0;
	}
</style>
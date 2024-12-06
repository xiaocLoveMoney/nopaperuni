<template>
	<view style="background-color: #EAEDF1;">
		<view
			style="margin-top: 40px;height: 40vh; background: linear-gradient(#64ace6, #EAEDF1);position: fixed; top: 0px; width: 100%; z-index: -1; left: 0; right: 0;" />

		<u-card title="每日签到情况">
			<view slot="body">
				<view style="width: 100%; height: 300px" id="chart2"></view>
			</view>
		</u-card>
		<u-card title="当天签到情况">
			<view slot="body">
				<view style="width: 100%; height: 300px" id="chart1" v-if="yibiao"></view>
				<u-empty text="所谓伊人，在水一方" mode="list" v-else></u-empty>
			</view>
		</u-card>
		<u-card title="考勤列表">
			<view slot="body">
				<u-table>
					<u-sticky>
						<u-tr>
							<u-th width="100px" class="table_td">日期</u-th>
							<u-th class="table_td">姓名</u-th>
							<u-th class="table_td">请假原因</u-th>
							<u-th class="table_td">状态标签</u-th>
						</u-tr>
					</u-sticky>
					<u-tr v-for="(item,index) in attendance_tableData" :key="index">
						<u-td width="100px" class="table_td">{{item.date}}</u-td>
						<u-td class="table_td">{{item.name}}</u-td>
						<u-td class="table_td">{{item.reason}}</u-td>
						<u-td class="table_td">
							<u-tag :text="item.tag" :size="'default'"></u-tag>
						</u-td>
					</u-tr>
				</u-table>
				<view style="padding: 1%">
					<u-button type="primary" style="width: 100%" @click="get_attendancelist" plain>
						更多数据
					</u-button>
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	import {
		get_chart2_options
	} from "../echarts/chart2";
	import {
		get_chart1_options
	} from "../echarts/chart1";
	import * as echarts from "echarts";
	export default {
		data() {
			return {
				attendancelist_page: 1,
				attendance_tableData: [],
				yibiao: true,
			}
		},
		methods: {
			echarts_fun() {
				this.$u.get("/api/analysis/chart2").then(res => {
					console.log(res)
					var dom = document.getElementById('chart2');
					var myChart = echarts.init(dom);
					var option = get_chart2_options(res)
					console.log(option)
					myChart.setOption(option);

				})
				this.$u.get("/api/analysis/chart1").then(res => {
					console.log(res)
					var dom = document.getElementById('chart1');
					var myChart2 = echarts.init(dom);
					if (res.code != 200 || res.data.length == 0) {
						this.yibiao = true
						return
					}
					var option = get_chart1_options(res)
					myChart2.setOption(option);

				}).catch(error => {
					console.log(error);
					this.yibiao = false
				})
			},
			get_attendancelist() {
				this.$u.get(`/api/attendance/attendancelist?page=${this.attendancelist_page}`).then(res => {
					console.log(res)
					res.data.forEach(item => {
						this.attendance_tableData.push({
							attendance_id: item.attendance_id,
							date: item.date,
							name: item.stu_name,
							reason: item.reason == "null" || item.reason == null || item.reason ==
								"" ? "暂无原因" : item.reason,
							tag: item.status
						})
					})
					this.attendance_tableData = this.attendance_tableData.sort((a, b) => new Date(b.date) -
						new Date(a.date))
				})
				console.log(this.attendance_tableData)
				this.attendancelist_page += 1;
			},
		},
		onLoad() {
			this.echarts_fun()
			this.get_attendancelist()
		}
	}
</script>

<style>

</style>
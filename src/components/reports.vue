<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1='数据统计' level2='数据报表'></cus-bread>
        <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
</template>

<script>
import MyEcharts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = MyEcharts.init(document.getElementById("main"));
      // 指定图表的配置项和数据

      const res = await this.$http.get(`reports/type/1`);
      const option2 = res.data.data;
      const option1 = {
        title: {
          text: "我是图示"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      const option = { ...option2, ...option1 };
      myChart.setOption(option);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>

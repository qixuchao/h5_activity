Vue.directive('swiper', {
	isFn: true,
	deep: true,
	bind: function(el, binding) {

	},
	update: function(el, binding) {
		if (!binding.value || el.$swiper) {
			return;
		}
		var swiper = new Swiper(el, binding.value);
		el.$swiper = swiper;
	}
});

Vue.directive('echarts', {
	isFn: true,
	deep: true,
	bind: function(el, binding) {
		var myChart = echarts.init(el);
		el.$echarts = myChart;
	}
});

var app = new Vue({
	el: '#container',
	//template:'<div><div v-for="item in list">{{item.type}}</div></div>',
	data: {
		counter: 0,
		list: data,
		verdict: verdict,
		typeMap: ["身体指标", "饮食", "运动", "睡眠", "情绪"],
		optionMap: ["A", "B", "C", "D", "E", "F", "G"],
		swiperOptions: null,
		groupGrade: {},
		total: 0,
		preSelect: {},
		stature: "",
		weight: "",
		bmiValue: "0",
		bmiValueToFixed: "？",
		comments:{
		},
		showResult:false,
		showIndex:true,
		BMI:''
	},
	methods: {
		slidePrev: function() {
			this.$refs.swiper.$swiper.slidePrev();
		},
		slideNext: function() {
			this.$refs.swiper.$swiper.slideNext();
		},
		selectOptions: function(grade, type, index) {
			console.log(grade, type, index)
			var _grade = grade;
			if (this.preSelect[index]) {
				grade -= this.preSelect[index];
			}
			console.log(grade)
			this.total += parseInt(grade);
			console.log(this.groupGrade)
			this.groupGrade[type] = this.groupGrade[type] || 0; //默认值0

			this.groupGrade[type] += parseInt(grade); //

			this.preSelect[index] = _grade;
		},
		bmiUpdate: function() {
			if (this.stature > 0 && this.weight > 0) {
				console.log(Math.pow(this.stature, 2))
				var b = this.weight,
					a = this.stature,
					value;
				this.bmiValue = b * 1.0 / ((a * 1.0 / 100) * (a * 1.0 / 100));
				this.bmiValueToFixed = this.bmiValue.toFixed(1);
				
				var bmi1 = this.bmiValue
				if (bmi1 >= 27.4) {
					value = 1;
					this.BMI = 2;
				}else if(bmi1 < 18.5){
					value = 1;
					this.BMI = 3;
				} else if (bmi1 >= 18.5 && bmi1 < 23) {
					value = 7;
					this.BMI = 0;
				} else if (bmi1 >= 23 && bmi1 < 27.4) {
					value = 4;
					this.BMI = 1;
				}
				// this.BMI = value;
				this.selectOptions(value, 1, 0)
			}
		},
		submit:function(){
			//this.$refs.echarts.$echarts.setOption(option);
			var data = [],
				map = [1,2,3,4,5],
				score,
				index;
			for(var i=0,len=map.length;i<len;i++){
				score = this.groupGrade[map[i]];
				data.push(score);
				if(map[i] == 1){
					this.comments['BMI'] = verdict[map[i]][this.BMI];
				};
				if(map[i] == 2){
					if(score>40){
						index = 0;
					}else if(score>30&&score<=40){
						index = 1;
					}else if(score<=30){
						index = 2;
					}
					this.comments['饮食'] = verdict[map[i]][index];
				};
				if(map[i] == 3){
					if(score>15){
						index = 0;
					}else if(score<=15){
						index = 1;
					}
					this.comments['运动'] = verdict[map[i]][index];
				};
				if(map[i] == 4){
					if(score>2){
						index = 0;
					}else if(score<=2){
						index = 1;
					}
					this.comments['情绪'] = verdict[map[i]][index];
				};
				if(map[i] == 5){
					if(score>3){
						index = 0;
					}else if(score<=3){
						index = 1;
					}
					this.comments['睡眠'] = verdict[map[i]][index];
				};
			}
			setTimeout(function(){
				option.series[0].data[0]  = data;
				myChart.setOption(option);
				this.showResult = true;
			}.bind(this))
		},
		reset:function(){
			this.showResult = false;
			this.showIndex = true;
			this.$refs.swiper.$swiper.slideTo(0)
		},
		openShare:function(){
			jskit.openShare({
				title:"",
				desc:"",
				img:"",
				link:""
			})
		},
		indexStart:function(){
			this.showIndex = false;
			setTimeout(function(){
				this.swiperOptions = {};
			}.bind(this))
			//this.$refs.swiper.$swiper.update();
		},
		returnIndex:function(){
			this.showIndex = true;
		}
	},
	mounted: function() {

	}
});

var dpr = window.devicePixelRatio || 2;

var fontSize = dpr / 2 * 24,
	lineWidth = dpr / 2 * 5,
	symbolSize = dpr / 2 * 10;

var option = {
	tooltip: {},
	radar: {
		// shape: 'circle',
		indicator: [{
			name: '身体指标',
			max: 13
		},{
			name: '饮食',
			max: 56
		}, {
			name: '运动',
			max: 21
		}, {
			name: '睡眠',
			max: 6
		}, {
			name: '情绪',
			max: 4
		}],
		name: {
			textStyle: {
				color: 'rgb(83, 172, 40)',
				fontSize: fontSize
			}
		},
		splitLine: {
			lineStyle: {
				width: lineWidth,
				color: [
					'#edf3e4', '#edf3e4'
				]
			}
		},

		splitArea: {
			show: false
		},
		axisLine: {
			lineStyle: {
				width: lineWidth,
				color: 'rgba(83, 172, 40)'
			}
		}
	},

	series: [{
			type: 'radar',
			lineStyle: {
				normal: {
					width: 1,
					opacity: 0.5
				}
			},
			data: [
				[30,20,2,3,10]
			],
			symbol: 'circle',
			symbolSize: symbolSize,
			itemStyle: {
				normal: {
					color: '#cbe7a2'
				}
			},
			areaStyle: {
				normal: {
					opacity: 0.4
				}
			}
		},

	]
};

var myChart = echarts.init(document.querySelector('.gl-conclusion-chart'));


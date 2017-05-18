if ('addEventListener' in document) { //解决 input选中延迟问题
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}
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
		//bmiValueToFixed: "？",
		comments:{
		},
		showResult:false,
		showIndex:true,
		BMI:'',
		showShare:'',
		selectState:selectState,
		genderSelect:false,
		general:"",
		sex:"",
		answerList:{}
	},
	methods: {
		slidePrev: function() {
			this.$refs.swiper.$swiper.slidePrev();
		},
		slideNext: function() {
			this.$refs.swiper.$swiper.slideNext();
		},
		selectOptions: function(grade, type, index , option) {
			var _grade = grade;
			this.$set(this.selectState,index,true);

			this.checkLockStatus();

			if (this.preSelect[index]) {
				grade -= this.preSelect[index];
			}
			//保存选项
			this.answerList[index] = option;
			this.total += parseInt(grade);
			this.groupGrade[type] = this.groupGrade[type] || 0; //默认值0

			this.groupGrade[type] += parseInt(grade); //

			this.preSelect[index] = _grade;
		},
		bmiUpdate: function(val) {
			if(val == 'true'){
				this.genderSelect = true;
			}
			else if (this.stature > 0 && this.weight > 0) {
				var b = this.weight,
					a = this.stature,
					value,sum;
				 sum = b / ((a / 100) * (a / 100));
				//this.bmiValueToFixed = this.bmiValue.toFixed(1);
				if(sum>0){
					this.bmiValue = sum;
					if (sum >= 27.4){
						value = 1;
						this.BMI = 2;
					}else if(sum < 18.5){
						value = 1;
						this.BMI = 3;
					} else if (sum >= 18.5 && sum < 23) {
						value = 7;
						this.BMI = 0;
					} else if (sum >= 23 && sum < 27.4) {
						value = 4;
						this.BMI = 1;
					}
					// this.BMI = value;
					this.selectOptions(value, 1, 0)	;
				}
			};
			if(this.genderSelect == true && this.bmiValue > 0){
				// console.log(this.genderSelect)
				//this.selectState[0] = true;
				//this.checkLockStatus()
				// console.log(selectState)
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
			if(this.total<60){
				this.general = comments[0];
			}else if(60<= this.total && this.total <= 70){
				this.general = comments[1];
			}else if(70<= this.total && this.total <= 80){
				this.general = comments[2];
			}else if(this.total > 80){
				this.general = comments[3];
			}

			setTimeout(function(){
				option.series[0].data[0]  = data;
				myChart.setOption(option);
				this.showResult = true;
			}.bind(this));

			var id = (new Date()).getTime()
			this.$http.get('http://openapi.fancysmp.com/api/create?project=carden_of_life_total',{
				params:{
					height:this.stature,
					weight:this.weight,
					sex:this.sex,
					total:this.total,
					record:JSON.stringify(this.answerList),
					id:id
				}
			}).then(function(response){
				console.log(response)
			   // get body data

			 },function(err){

			 });
		},
		reset:function(){
			this.showResult = false;
			this.showIndex = true;
			this.$refs.swiper.$swiper.slideTo(0);
			this.stature = "";
			this.weight = "";
			this.bmiValueToFixed = "?"; 
			this.groupGrade={};
			this.preSelect = {};
			this.total = 0;
			var radio = Array.prototype.slice.call(document.querySelectorAll('input[type="radio"]'));
			radio.forEach(function(e){e.checked = false});
			this.selectState = {};
			this.checkLockStatus();
		},
		openShare:function(){
			this.showShare = true;
			jskit.openShare && jskit.openShare({
				title:"我的健康自测",
				desc:"美国高端有机膳食补充剂品牌Garden of Life（生命花园）以“成就非凡健康”为己任，目标是为消费者提供最干净，最优质的全食物营养成分",
				imgUrl:"http://static.fancysmp.com/activity/gardenLeft/img/share_200x200.png",
				link:location.href
			});
		},
		closeShare:function(){
			this.showShare = false;
		},
		indexStart:function(){
			this.showIndex = false;
			var self = this;
			setTimeout(function(){
				this.swiperOptions = {
					onInit:function(swiper){
						swiper.lockSwipeToNext();
						
					},autoHeight:true,
					onSlidePrevStart:function(swiper){
						swiper.unlockSwipeToNext();
					},
					onSlideNextEnd:function(swiper){
						var val = swiper.activeIndex;
						if(self.selectState[val+1]){
							swiper.unlockSwipeToNext();
						}else{
							swiper.lockSwipeToNext();
						}
					}
				};
				
			}.bind(this));
		},
		returnIndex:function(){
			this.showIndex = true;
		},
		checkLockStatus:function(){
			var swiper = this.$refs.swiper
			if(swiper){
				var index = swiper.$swiper.activeIndex;
				console.log(this.selectState[index])
				if(this.selectState[index]){
					swiper.$swiper.unlockSwipeToNext();
				}else{
					swiper.$swiper.lockSwipeToNext();
				}
			}
		}
	},
	
	computed:{
		bmiValueToFixed:function(){
			if(!this.weight || !this.stature){
				return '?'
			}
			return (this.weight / Math.pow(this.stature/100,2)).toFixed(1);
		}
	},
	mounted: function() {
		jskit.openShare && jskit.openShare({
			title:"我的健康自测",
			desc:"美国高端有机膳食补充剂品牌Garden of Life（生命花园）以“成就非凡健康”为己任，目标是为消费者提供最干净，最优质的全食物营养成分",
			imgUrl:"http://static.fancysmp.com/activity/gardenLeft/img/share_200x200.png",
			link:location.href
		});
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
/*清除微信拖动超出范围*/
// document.addEventListener('touchmove', function(event) {event.preventDefault();}, false);

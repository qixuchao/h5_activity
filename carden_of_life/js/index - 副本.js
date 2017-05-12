Vue.directive('swiper', {
	isFn: true,
	deep: true,
	bind:function(el,binding){
	    
	},
	update:function(el,binding) {
		
		if (!binding.value) {
			return;
		}
		
		var swiper = new Swiper(el,binding.value);
		el.$swiper = swiper;
	}
});

var app = new Vue({
	el: '#container',
	//template:'<div><div v-for="item in list">{{item.type}}</div></div>',
	data: {
		counter: 0,
		list: data,
		typeMap: ["身体指标", "饮食", "运动", "睡眠", "情绪"],
		optionMap: ["A", "B", "C", "D", "E", "F", "G"],
		swiperOptions:null,
		groupGrade:{},
		total:0,
		preSelect:{},
		stature:"",
		weight:"",
		bmiValue:"20.7"
	},
	methods:{
		slidePrev:function(){
			this.$refs.swiper.$swiper.slidePrev();
		},
		slideNext:function(){
			this.$refs.swiper.$swiper.slideNext();
		},
		selectOptions:function(grade,type,index){
			if(typeof this.preSelect[type]=="undefined"){
				this.preSelect[type]={
					[index]:grade || 0
				}
			}else{
				this.preSelect[type][index]= grade || 0;
			}
			// console.log(this.preSelect)
			// var _grade = grade;
			// if(this.preSelect[index]){
			// 	grade = this.preSelect[index] - grade;
			// }
			// console.log(grade)
			// this.total += parseInt(grade);
			// this.groupGrade[type] = this.groupGrade[type] || 0; //默认值0

			// this.groupGrade[type] += parseInt(grade); //

			// this.preSelect[index] = _grade;//根据问题的index值 赋值
		},submit1:function(){
			var i=0;
			var preSelect2 = this.preSelect;
			console.log(preSelect2 )
			for(i;i<preSelect2.length;i++){
				var x = 0;
				for(x;x<preSelect2[i].length;x++){
						this.groupGrade[i]+=parseInt(preSelect2[i][x])
					// if(typeof this.groupGrade[i]=="undefined"){
					// 	this.groupGrade[i]+=preSelect2[i][x]
					// }else{
					// 	this.groupGrade[type][index]= grade || 0;
					// }

				}
				this.total+=parseInt(this.groupGrade[i])
			}
			console.log(this.total,this.groupGrade)

		},bmiUpdate:function(){
			if(this.stature>0&&this.weight>0){
				console.log(Math.pow(this.stature,2))
				var b = this.weight,
					a = this.stature,value;
				this.bmiValue =b*1.0/((a*1.0/100)*(a*1.0/100));
				var bmi1 = this.bmiValue
				if(bmi1>=27.4||bmi1<18.5){
					value = 1;
				}else if(bmi1>=18.5&&bmi1<23){
					value = 7;
				}else if(bmi1>=23&&bmi1<27.4){
					value = 4;
				}
				this.selectOptions(value,1,0)
			}
		}
	},
	mounted:function(){
		this.swiperOptions = {};
	}
});
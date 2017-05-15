(function(){

	var app = new Vue({
		el: '.container',
		data: {
			QAIndex:0,
			sex:0,
			showDialog:false,
			subject:[
				{
					question:'手臂：你一周运动多久？',
					answer:[
						{
							option:'不怎么运动',
							score:1
						},
						{
							option:'1-3小时',
							score:2
						},
						{
							option:'3-5小时',
							score:3
						},
						{
							option:'6小时以上',
							score:4
						},
					]
				},
				{
					question:'嘴巴：你平时爱吃什么？',
					answer:[
						{
							option:'无辣不欢',
							score:2
						},
						{
							option:'蔬果爱好者',
							score:4
						},
						{
							option:'快餐党',
							score:2
						},
						{
							option:'肉食动物',
							score:2
						},
					]
				},
				{
					question:'肠：你的肠道通畅么？',
					answer:[
						{
							option:'畅通无阻',
							score:4
						},
						{
							option:'偶尔通畅',
							score:2
						},
						{
							option:'经常便秘',
							score:1
						}
					]
				},{
					question:'肚子：你喜欢吃甜食么？',
					answer:[
						{
							option:'超级喜欢',
							score:1
						},
						{
							option:'一般般吧，看心情',
							score:2
						},
						{
							option:'严格控制甜食',
							score:4
						}
					]
				}

			],
			organ:{

			},
			selectIndex:0,
			selectScore:0,
			total:0,
			step:3
		},
		methods:{
			openDialog:function(index){
				this.QAIndex = index;
				this.showDialog = true;
			},
			closeDialog:function(){
				this.showDialog = false;
			},
			setOption:function(index,score){
				this.subject[this.QAIndex].answer[index].checked = true;
				this.selectScore = score;
			},
			submit:function(){
				this.organ[this.QAIndex] = this.selectScore;
				this.closeDialog();
				var length = 0;
				for(var i in this.organ){
					this.total += this.organ[i];
					length ++;
				}
				if(length == 4){
					this.step = 3;
				}
			},
			showResult:function(){

			}
		},
		computed:{
			// total:function(){
			// 	console.log(22)
			// 	var total = 0;
			// 	for(var i in this.organ){
			// 		total += this.organ;
			// 	}
			// 	return total;
			// }
		}

	});

})();

// 手臂：你一周运动多久？
// A 不怎么运动 
// B 1-3小时 
// C 3-5小时  
// D 6小时以上 
// 嘴巴：你平时爱吃什么？
// A 无辣不欢
// B 蔬果爱好者
// C 快餐党
// D 肉食动物
// 肠：你的肠道通畅么？
// A 畅通无阻
// B 偶尔通畅
// C 经常便秘
// 肚子：你喜欢吃甜食么？
// A 超级喜欢
// B 一般般吧，看心情
// C 严格控制甜食


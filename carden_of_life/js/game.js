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
			step:0,
			remark:{
				man_01:"你不能忍受和心爱的人之间，多出哪怕1毫米脂肪的距离。肌肉和线条就是你自带的名片，不过小心用力过猛，自练招数走火入魔。一款优质的蛋白粉会让你的饮食和运动计划更有效。",
				man_02:"和男神一秒吸睛的亮眼不同，你的优势是恰到好处的温和。均衡膳食，合理补充蛋白质，即使没有巧克力的八块肌，但一分不多一分不少的匀称也可以穿上白衬衣，让女孩靠在你恰到好处的肩膀上。",
				man_03:"对于外表，你也许更注重内在。觉得不如及时行乐，反正脂肪下的才华就像怀孕，日子久了总能看出来。但要是吃着也能调整体重，你会不会抓住成为男神的机会？",
				female_01:"身材火辣的你，更希望成为和男神比肩齐眉的女神。不要对自己太苛刻哦，匀称的好体型并不需要你剑拔弩张地对抗饥饿感。适当的营养和运动，搭配既可以燃脂又有饱腹感的蛋白粉，让男神的目光，每一寸都属于你。",
				female_02:"在胖与瘦之间的你总在减与不减之间犹豫，男神则在你身边忽远忽近。谁说鱼和熊掌不可兼得？在日常饮食之外补充高质量的蛋白质，还能帮你燃烧脂肪，抵抗饥饿，美食与美丽，你可以一个都不放弃。至于男神，就在你触手可及的距离！",
				female_03:"对于你而言，生活里没有什么是吃搞不定的：生活不顺心，吃！聚会太开心，吃！男神太遥远吃！吃！吃！脂肪与体重齐飞，脖颈肚腩共一块肉。的确，生活里有很多是能靠吃能解决的——比如含有神奇燃脂原料的瘦身蛋白粉，吃着吃着就瘦了，你要不要吃吃看？"
			},
			dateUrl:{
				weibo01:["https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=3161393975&activityId=fcf581eac6e84bfdbde58e1c1f1107e3","https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=3161393975&activityId=cd66aa28728946508a6bbd36616d6ac9"],
				// weibo02:,
				weibo03:"http://h5.m.taobao.com/awp/core/detail.htm?id=545126126708",
				weixin01:"https://shop.m.jd.com?shopId=631019",
				// weixin02:"http://static.fancysmp.com/activity/gardenLeft/QA.html",
				weixin03:"http://c.b0yp.com/h.6LaQH2?cv=6mb5Zuk8J68&sm=607ad6",
			},
			remarkImgUrl:"",
			remarkTitle:"",
			resultBg:"",
			aUrl:{
				2:"http://static.fancysmp.com/activity/gardenLeft/QA.html?channle=",
			},
			submitDisabled:false,
			optionMap: ["A", "B", "C", "D", "E", "F", "G"],
			showShare:''
		},
		methods:{
			openDialog:function(index){
				this.QAIndex = index;
				this.showDialog = true;
				var radio = Array.prototype.slice.call(document.querySelectorAll('input[type="radio"]'));
				radio.forEach(function(e){e.checked = false});
			},
			closeDialog:function(){
				this.showDialog = false;
				this.submitDisabled = false;
			},
			setOption:function(index,score){
				this.subject[this.QAIndex].answer[index].checked = true;
				this.selectScore = score;
				this.submitDisabled = true;
			},
			submit:function(){
				this.organ[this.QAIndex] = this.selectScore;
				this.selectScore = 0;
				this.closeDialog();
				var length = 0,
					total = 0;
				for(var i in this.organ){
					if(this.organ[i]>0){
						total += this.organ[i];
						length ++;
					}else{
						return false;
					}
				}
				this.total = total;
				if(length == 4){
					this.step = 3;
					this.showResult();
				}
			},
			showResult:function(){
				var total = this.total;
				var length = 0;
				var type = "";
				if(total>4&&total<9){
					length = 3;
				}else if(total>8&&total<13){
					length = 2;
				}else if(total>12&&total<17){
					length = 1;
				}
				if(this.sex == 0){
					type = "female_0"
				}else{
					type = "man_0"
				}
				this.resultBg = type+length;
				this.remarkTitle = this.remark[type+length];


				(new Image()).src = jskit.utils.addParam('http://openapi.fancysmp.com/api/create?project=carden_of_life_count',{
					id:+ new Date()
				});
			},
			jumpUrl:function(type){ 
				var url;
				url = "http://openapi.fancysmp.com/api/create?project=carden_of_life_btn&channel=1&type=1"+type;
				(new Image()).src = jskit.utils.addParam(url,{
					id:+ new Date()
				});
				 window.location.href = this.aUrl[type];
			},
			openShare:function(){
				this.showShare = true;
			},
			closeShare:function(){
				this.showShare = false;
			},
		},
		mounted: function() {
			var channel = jskit.utils.getUrlObj().channel || 1;
			document.documentElement.className += (" pc-qrcode-channel"+channel);

			var channerType = "";
			if(channel == 1){//是否是微信 
				channerType = "weixin";
				this.aUrl[1] = this.dateUrl[channerType+"01"]; //优惠地址
			}else{ // if(channel == 2) || !channel  是否微博 或者其他
				channerType = "weibo";
				this.$http.get('http://openapi.fancysmp.com/api/count?project=carden_of_life_count').then(function(response){
						var userId = response.data.data;
						if(userId%10 == 0){
							this.aUrl[1] = this.dateUrl[channerType+"01"][1];
						}else{
							this.aUrl[1] = this.dateUrl[channerType+"01"][0];
						}
				 },function(err){
				 });
			}
			this.healthTest += channel;
			this.aUrl[3] =  this.dateUrl[channerType+"03"]; //暗号地址

			jskit.openShare && jskit.openShare({
				title:"《测测你与男神的距离》",
				desc:"你一直好奇却又不敢确定，快来测测你与男神的距离有多远",
				imgUrl:"http://static.fancysmp.com/activity/gardenLeft/img/game_share_200x200.png",
				link:location.href
			});
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


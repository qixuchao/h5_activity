var data = [{
		query:"您的年龄是？",
		answer:[{
			text:"18~30岁",
			grade:"6"
		},{
			text:"30~40岁",
			grade:"4"
		},{
			text:"40~50岁",
			grade:"2"
		},{
			text:"＞50岁",
			grade:"1"
		}],
		type:1
	},{
		query:"每周吃几次粗杂粮？",
		value:"常见粗杂粮包括有：玉米、燕麦、糙米、黑米、薏米、紫米、红豆、绿豆、红薯、土豆、山药、莲藕、南瓜等",
		answer:[{
			text:"＞5次",
			grade:"8"
		},{
			text:"3~5次",
			grade:"5"
		},{
			text:"＜3次",
			grade:"2"
		}],
		type:2
	},{
		query:"平均每天摄入多少蔬菜？",
		value:"注：这里特指经过烹调加工的熟制蔬菜",
		answer:[{
			text:"4~5拳体积大小",
			grade:"8"
		},{
			text:"1~3拳体积大小",
			grade:"5"
		},{
			text:"＜1拳体积大小",
			grade:"2"
		}],
		type:2
	},{
		query:"平均每天摄入多少水果？",
		answer:[{
			text:"＞2拳体积大小",
			grade:"8"
		},{
			text:"1~2拳体积大小",
			grade:"5"
		},{
			text:"＜1拳体积大小",
			grade:"2"
		}],
		type:2
	},{
		query:"平均每天摄入多少奶和奶制品？",
		answer:[{
			text:"300~500 ml",
			grade:"8"
		},{
			text:"300ml左右",
			grade:"5"
		},{
			text:"＜300 ml",
			grade:"2"
		}],
		type:2
	},{
		query:"平均每天摄入多少蛋白质类食物（鱼豆肉蛋）？",
		value:"注：此处“掌”是指除去手指的手掌",
		answer:[{
			text:"2~3掌",
			grade:"8"
		},{
			text:"＜2掌",
			grade:"5"
		},{
			text:"＜1掌",
			grade:"2"
		}],
		type:2
	},{
		query:"每天的饮水量是多少？",
		value:"注：一杯水在200 ml左右",
		answer:[{
			text:"≥2000 ml（10杯）",
			grade:"8"
		},{
			text:"1500~1700 ml（7~8杯）",
			grade:"5"
		},{
			text:"＜1500 ml（7杯）",
			grade:"2"
		}],
		type:2
	},{
		query:"你的饮食口味偏向于？",
		answer:[{
			text:"通常比较清淡，喜欢少油少盐的食物",
			grade:"8"
		},{
			text:"有时比较清淡，有时比较厚重",
			grade:"5"
		},{
			text:"饮食口味较重，偏好高油高盐食物",
			grade:"2"
		}],
		type:2
	},{
		query:"您每周做几次运动？",
		answer:[{
			text:"＞5次",
			grade:"7"
		},{
			text:"3~5次",
			grade:"4"
		},{
			text:"＜3次",
			grade:"1"
		}],
		type:3
	},{
		query:"平均每次运动的时长是多少？",
		answer:[{
			text:"＞60分钟",
			grade:"7"
		},{
			text:"30~60分钟",
			grade:"4"
		},{
			text:"10~30分钟",
			grade:"1"
		}],
		type:3
	},{
		query:"您通常进行哪些类型的运动？",
		value:"注：常见的有氧运动有跑步、骑单车、舞蹈等；抗阻力运动包括器械练习和自重练习等",
		answer:[{
			text:"有氧运动和抗阻力运动都有",
			grade:"7"
		},{
			text:"以有氧运动为主",
			grade:"4"
		},{
			text:"抗阻力运动为主",
			grade:"1"
		}],
		type:3
	},{
		query:"您晚上一般几点睡觉？",
		answer:[{
			text:"23：00之前",
			grade:"2"
		},{
			text:"23：00~24：00",
			grade:"1"
		},{
			text:"24：00以后",
			grade:"0"
		}],
		type:4
	},{
		query:"您每天的睡眠时间有多长？",
		answer:[{
			text:"7~9小时",
			grade:"2"
		},{
			text:"6~7小时",
			grade:"1"
		},{
			text:"＜6小时，或＞9小时",
			grade:"0"
		}],
		type:4
	},{
		query:"您觉得自己的睡眠质量如何？",
		answer:[{
			text:"很好",
			grade:"2"
		},{
			text:"一般",
			grade:"1"
		},{
			text:"较差",
			grade:"0"
		}],
		type:4
	},{
		query:"日常生活中，您的情绪容易受到外界环境的影响吗？",
		answer:[{
			text:"基本上不会",
			grade:"2"
		},{
			text:"偶尔会受到影响",
			grade:"1"
		},{
			text:"经常会受到影响",
			grade:"0"
		}],
		type:5
	},{
		query:"遇到情绪问题，您如何进行调节？",
		answer:[{
			text:"自己可以主动设法摆脱",
			grade:"2"
		},{
			text:"自己摆脱不了，需要借助别人的帮助或处境改变才能摆脱",
			grade:"1"
		},{
			text:"即使别人安慰、开导自己，也几乎完全无法摆脱",
			grade:"0"
		}],
		type:5
	}];
var verdict = {
	1:{
		a:["恭喜您，目前的体重在标准范围哦！","继续保持低糖，低脂，低热量，高纤，优蛋白的饮食。不能松懈。每周的运动，良好的睡眠和心情由你控。"],
		b:["需要注意了，体重超重哦！","运动难坚持，美食又难割舍，体重管理还得继续。怎么办？健康安全又容易坚持的瘦身蛋白质粉 可以助你一臂之力。"],
		c:["您目前属于肥胖了","肥胖带来的各种负担和风险，我想您一定都知晓了。动起来，改变就在眼前。夏天来临，选择瘦身又营养均衡的蛋白粉是不错的选择哦。"],
		d:["您目前偏瘦","要注意营养补充了，胃肠、消化吸收功能很重要，不然再补营养也白搭。高品质活性益生菌利于肠道营养吸收，好品质易吸收的蛋白粉选起来"]
	},
	2:{
		a:["恭喜您，目前的体重在标准范围哦！","继续保持低糖，低脂，低热量，高纤，优蛋白的饮食。不能松懈。每周的运动，良好的睡眠和心情由你控。"],
		b:["需要注意了，体重超重哦！","运动难坚持，美食又难割舍，体重管理还得继续。怎么办？健康安全又容易坚持的瘦身蛋白质粉 可以助你一臂之力。"],
		c:["您目前属于肥胖了","肥胖带来的各种负担和风险，我想您一定都知晓了。动起来，改变就在眼前。夏天来临，选择瘦身又营养均衡的蛋白粉是不错的选择哦。"],
		d:["您目前偏瘦","要注意营养补充了，胃肠、消化吸收功能很重要，不然再补营养也白搭。高品质活性益生菌利于肠道营养吸收，好品质易吸收的蛋白粉选起来"]
	},
	3:{
		a:["恭喜您，目前的体重在标准范围哦！","继续保持低糖，低脂，低热量，高纤，优蛋白的饮食。不能松懈。每周的运动，良好的睡眠和心情由你控。"],
		b:["需要注意了，体重超重哦！","运动难坚持，美食又难割舍，体重管理还得继续。怎么办？健康安全又容易坚持的瘦身蛋白质粉 可以助你一臂之力。"],
		c:["您目前属于肥胖了","肥胖带来的各种负担和风险，我想您一定都知晓了。动起来，改变就在眼前。夏天来临，选择瘦身又营养均衡的蛋白粉是不错的选择哦。"],
		d:["您目前偏瘦","要注意营养补充了，胃肠、消化吸收功能很重要，不然再补营养也白搭。高品质活性益生菌利于肠道营养吸收，好品质易吸收的蛋白粉选起来"]
	},
	4:{
		a:["恭喜您，目前的体重在标准范围哦！","继续保持低糖，低脂，低热量，高纤，优蛋白的饮食。不能松懈。每周的运动，良好的睡眠和心情由你控。"],
		b:["需要注意了，体重超重哦！","运动难坚持，美食又难割舍，体重管理还得继续。怎么办？健康安全又容易坚持的瘦身蛋白质粉 可以助你一臂之力。"],
		c:["您目前属于肥胖了","肥胖带来的各种负担和风险，我想您一定都知晓了。动起来，改变就在眼前。夏天来临，选择瘦身又营养均衡的蛋白粉是不错的选择哦。"],
		d:["您目前偏瘦","要注意营养补充了，胃肠、消化吸收功能很重要，不然再补营养也白搭。高品质活性益生菌利于肠道营养吸收，好品质易吸收的蛋白粉选起来"]
	},
	5:{
		a:["恭喜您，目前的体重在标准范围哦！","继续保持低糖，低脂，低热量，高纤，优蛋白的饮食。不能松懈。每周的运动，良好的睡眠和心情由你控。"],
		b:["需要注意了，体重超重哦！","运动难坚持，美食又难割舍，体重管理还得继续。怎么办？健康安全又容易坚持的瘦身蛋白质粉 可以助你一臂之力。"],
		c:["您目前属于肥胖了","肥胖带来的各种负担和风险，我想您一定都知晓了。动起来，改变就在眼前。夏天来临，选择瘦身又营养均衡的蛋白粉是不错的选择哦。"],
		d:["您目前偏瘦","要注意营养补充了，胃肠、消化吸收功能很重要，不然再补营养也白搭。高品质活性益生菌利于肠道营养吸收，好品质易吸收的蛋白粉选起来"]
	}
}
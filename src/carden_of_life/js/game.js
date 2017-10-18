(function() {
	var host = 'http://openapi.fancysmp.com/',
		apiUrl = host+"api/create?project=";
	var channel = jskit.utils.getUrlObj().channel || '1';

	var app = new Vue({
		el: '.container',
		data: function() {
			
			return {
				QAIndex: 0,
				sex: 0,
				showDialog: false,
				subject: subject,
				organ: {

				},
				selectIndex: 0,
				selectScore: 0,
				total: 0,
				step: 0,
				channel: channel,
				remark: remark,
				dateUrl: dateUrl,
				remarkImgUrl: "",
				remarkTitle: "",
				resultBg: "",
				submitDisabled: false,
				optionMap: ["A", "B", "C", "D", "E", "F", "G"],
				showShare: '',
				record: [],
				winning: false
			}
		},
		methods: {
			openDialog: function(index) {
				this.QAIndex = index;
				this.showDialog = true;
				var radio = Array.prototype.slice.call(document.querySelectorAll('input[type="radio"]'));
				radio.forEach(function(e) {
					e.checked = false
				});
			},
			closeDialog: function() {
				this.showDialog = false;
				this.submitDisabled = false;
			},
			setOption: function(index, score) {
				this.subject[this.QAIndex].answer[index].checked = true;
				this.selectScore = score;
				this.submitDisabled = true;
				this.record[this.QAIndex] = index;
			},
			submit: function() {
				this.organ[this.QAIndex] = this.selectScore;
				this.selectScore = 0;
				this.closeDialog();
				var length = 0,
					total = 0;
				for (var i in this.organ) {
					if (this.organ[i] > 0) {
						total += this.organ[i];
						length++;
					} else {
						return false;
					}
				}
				this.total = total;
				if (length == 4) {
					this.step = 3;
					this.showResult();
				}
			},
			showResult: function() {
				var total = this.total;
				var length = 0;
				var type = "";
				if (total > 4 && total < 9) {
					length = 3;
				} else if (total > 8 && total < 13) {
					length = 2;
				} else if (total > 12 && total < 17) {
					length = 1;
				}
				if (this.sex == 0) {
					type = "female_0"
				} else {
					type = "man_0"
				}
				this.resultBg = type + length;
				this.remarkTitle = this.remark[type + length];

				pushData(apiUrl + 'carden_of_life_count', {
					id: this.channel
				});
				pushData(apiUrl + 'carden_of_life_game_QA', {
					channel: this.channel,
					record: JSON.stringify(this.record)
				});
			},
			jumpUrl: function(type) { //结果页按钮点击后执行跳转方法
				jumpUrl2(type,this.winning);
			},
			openShare: function() {
				this.showShare = true;
			},
			closeShare: function() {
				this.showShare = false;
			},

		},
		mounted: function() {
			var channel = this.channel;
			document.documentElement.className += (" pc-qrcode-channel" + channel);
			// var channerType = "";
			if (channel != 1) { //是否是微信 
				this.$http.get(host+'api/count?project=carden_of_life_count').then(function(response) {
					var count = response.data.data;
					console.log(count)
					if (count % 10 == 0 && count < 3000) {
						this.winning = true;
					}
				}, function(err) {});
			}
		},
		computed: {
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

	function pushData(url, param) { //@提交数据 url : (string)提交地址  param: (object) 查询参数 
		(new Image()).src = jskit.utils.addParam(url, param);
	};

	function jumpUrl2( type , winning) { //提交按钮type 信息 跳转页面
		
		pushData(apiUrl, {
			id: +new Date(),
			channel: channel,
			project:'carden_of_life_btn',
			type:type
		});

		var channerType = "";
		var href;

		if (type == 2) {
			href = dateUrl.QA + channel;
		} else if (channel != 1) { //是否是微信
			channerType = "weibo0";
			if (type == 1) {
				if (winning) {
					href = dateUrl[channerType + type][1];
				} else {
					href = dateUrl[channerType + type][0];
				}
			} else {
				href = dateUrl[channerType + type];
			}
		} else {
			channerType = "weixin0";
			href = dateUrl[channerType + type];
		};
		window.location.href = href;
	};
})();
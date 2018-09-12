!(function(){
	var requestAnimaFrame = function (callback) {
	  return window.requestAnimationFrame(callback) ||
	    window.webkitRequestAnimationFrame(callback) ||
	    window.mozRequestAnimationFrame(callback) ||
	    window.oRequestAnimationFrame(callback) ||
	    window.msRequestAnimationFrame(callback) ||
	    function (callback) {
	      setInterval(callback, 1000);
	    }
	}

	function getRandom(min,max){
		return Math.floor(min+Math.random()*max)
	}

	function Material(config){
		this.config = config
		this.init(config)
		this.$container = $(config.container)
	}
	Material.prototype = {
		init:function(config){
			this.$element = $('<img class="material" src="'+config.url+'">')

			this.$element.css({
				width:config.width/32+'rem',
				height:config.height/32+'rem',
				left:config.left/32+'rem'
			    //transform: 'translate('+config.left/32+'rem,'+config.top/32+'rem)'
			})
		},
		appendTo:function($container){
			this.$container.append(this.$element)
		},
		getBoundingClientRect:function(){
			return this.$element[0].getBoundingClientRect()
		},
		horizontalRect(){
			var rect = this.getBoundingClientRect()
			return rect.left + rect.width

		},
		destroy:function(){
			this.$element.remove()
		},
		run:function(){
			setTimeout(function(){
				this.$element.css({
				    transform: 'translateY('+window.innerHeight/32*2+'rem)'
				})
			}.bind(this))
		}
	}

	/**
	*
	* @params
	* config 
	*	container {String} 容器 
	*   rowMax    {Number} 一行最大个数
	*   resource  {Array}  资源列表
	*/
	function MaterialGroup(config){
		this.config = config;
		this.materials = []
		this.$stage = $(config.container)
		this._currentIndex = 0;
		this.start()
	}
	MaterialGroup.prototype = {
		init:function(){

		},
		start:function(){
			this.append()
		},
		getNextLeft(){
			var length = this.materials.length
			if( length === 0 &&  length % this.config.rowMax === 0){
				return 100
			}
			return this.materials[length - 1].horizontalRect()
		},
		append:function(){
			var index =getRandom(0,this.config.resource.length-1)
			var config = this.config.resource[index]
			config.top = 0;
			config.container = config.container || '.play-stage'
			config.left = this.getNextLeft();


			if(this._currentIndex>this.config.rowMax){
				this._currentIndex = 0
			}
			config.left = this._currentIndex++ * 115;
			var material = new Material(config)
			material.appendTo()
			material.run();
			this.materials.push(material)
			setTimeout(function(){
				this.append()
			}.bind(this),getRandom(100,600))
		},
		each(callback){
			$.each(this.materials,callback)
		}
	}

	function Rabbit(container){
		this.rabbit = $(container)
		this.init()
	}

	Rabbit.prototype = {
		init:function(){
			this.rabbit.append('<img src="./image/tuzi.png">')
		},
		getBoundingClientRect:function(){
			return this.rabbit[0].getBoundingClientRect()
		}	
	}

	function Game(config){
		this._isStart = false
		this.config = config
		this.rabbit = new Rabbit('.tuzi')
	}
	Game.prototype = {
		start:function(){
			this._isStart = true;
			this.init()
			this.collisionDetection()
		},
		init:function(){
			this.materialGroup = new MaterialGroup({
				container: this.config.stage,
				rowMax:6,
				resource:[
					{width:115,height: 115,url:"image/1.png"},
					{width:121, height:73, url:"image/2.png"},
					{width:150,height: 130,url:"image/3.png"},
					{width:90, height:90, url:"image/4.png"},
					{width:110,height: 110,url :"image/5.png"},
					{width:90, height:110, url:"image/6.png"},
				]
			})
		},
		check(rect1,rect2){
			return rect1.left <= rect2.right && rect1.right >= rect2.left 
				&& rect2.bottom >= rect1.top &&  rect2.top <= rect1.bottom
		},
		collisionDetection(){
			let rabbitRect = this.rabbit.getBoundingClientRect()
			this.materialGroup.each(function(_,item){
				if(item && this.check(rabbitRect,item.getBoundingClientRect())){
					//debugger
					item.destroy()
					item = null
				}
			}.bind(this))
			if(this._isStart){
				requestAnimationFrame(this.collisionDetection.bind(this))
			}
		}
	}

	var game = new Game({
		stage:".play-stage",
		rowMax:6,
		resource:[
			{width:115,height: 115,url:"image/1.png"},
			{width:121, height:73, url:"image/2.png"},
			{width:150,height: 130,url:"image/3.png"},
			{width:90, height:90, url:"image/4.png"},
			{width:110,height: 110,url :"image/5.png"},
			{width:90, height:110, url:"image/6.png"},
		]
	})


	game.start()



})();
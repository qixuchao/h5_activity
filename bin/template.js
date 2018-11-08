const fs = require('fs');
const path = require('path');
const glob = require("glob");
const chalk = require('chalk')

const script = process.argv[2];
const args = process.argv.slice(3);



function printHelp(){
	console.log(chalk.green(fs.readFileSync(__dirname+'/USAGE').toString()))
}

function addTracking(advid){
	if(advid){
		let code = `	<!-- ft tag -->
	<script type="text/javascript">
	    _ft_ = _ft_ || [];
	    _ft_.push(['aid', '${advid}']);
	    +(function () {
	        var s = document.createElement('script');
	        s.type = 'text/javascript';
	        s.async = true;
	        s.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://pic.fancyapi.com/SDK/ft.js';
	        var w = document.getElementsByTagName('script')[0];
	        w.parentNode.insertBefore(s, w);
	    })();
	</script>
	<!--ft tag-->`

		glob("src/*/*.html", function (er, files) {
			 files.forEach(function(path){
			 	let html = fs.readFileSync(path).toString();
			 	html = html.replace(/<\/head>/,code + '\n</head>')
			 	fs.writeFileSync(path,html)
			 })
		})
	}else{
		console.log(chalk.red('advid can not be empty.'))
	}
}

switch(script){
	case '-h':
  	case '--help':
  		printHelp()
    	break;
    case '-ft':
    	addTracking.apply(null,args)
    	break;
	default:
		printHelp()
    break;
}
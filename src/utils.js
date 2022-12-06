const formatDate = ({ date, timeZone, showTimeZone = true })=> {
  return moment(date).tz(timeZone).format(`MM/DD/YYYY h:mma${ showTimeZone ? ' z': ''}`); 
}

const criticalErrors = (code, JSHINT)=> {
  JSHINT(code);
  let errors = JSHINT.errors;
  errors = errors.filter( e => e.code.startsWith('E')).map(e => new Error(e.reason));
  if(errors.length){
    return errors;
  }
}


const _logger = (div)=> {
  const fn = (...messages)=> {
    if(messages[0] === null){
      return div.innerHTML = '';
    }
    if(messages[0] instanceof Error){
      div.innerHTML = '';
    } 
    //div.innerHTML = '';
    messages.forEach( message => {
      let _message = message;
      if(!(message instanceof Error)){
        _message = typeof message === 'object' ? `<pre>${JSON.stringify(message, null, 2)}</pre>` : message;
      }
      else {
        _message = message.message
      }
      //if message is error, clear it out!
    
      if(div){
        div.innerHTML += `<div ${ message instanceof Error ? 'style=color:red': ''}><span class='cursor'>&gt;&gt; </span>${_message}</div>`;
      }
    });
  };
  fn.div = div;
  return fn;
};

const infiniteFree = (code)=>{
  return new Promise((resolve, reject)=> {
    limitEval(`let ex;try{${code}}catch(e){
      ex = e;
    };ex`, (...args)=> {
      if(args.length === 2){
        resolve();
      }
      else {
        reject(new Error('infinite loop detected'));
      }
    }, 1000);

  });
};

function limitEval(code, fnOnStop, opt_timeoutInMS) {
  const start = new Date();
  var id = Math.random() + 1,
    blob = new Blob(
      ['onmessage=function(a){a=a.data;postMessage({i:a.i+1});const result=eval.call(this,a.c);postMessage({r: result ? result.toString(): null,i:a.i})};'],
      { type:'text/javascript' }
    ),
    myWorker = new Worker(URL.createObjectURL(blob));

  function onDone() {
    URL.revokeObjectURL(blob);
    fnOnStop.apply(this, arguments);
  }

  myWorker.onmessage = function (data) {
    data = data.data;
    if (data) {
      if (data.i === id) {
        id = 0;
        onDone(true, data.r);
      }
      else if (data.i === id + 1) {
        setTimeout(function() {
          if (id) {
            myWorker.terminate();
            onDone(false);
          }
        }, opt_timeoutInMS || 1000);
      }
    }
  };

  myWorker.postMessage({ c: code, i: id });
}


const executeCode = function(code, logger, JSHINT = window.JSHINT){
  if(!code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim()){
    return logger(null);
  }
  code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'');
  const _criticalErrors = criticalErrors(code, JSHINT);
  if(_criticalErrors){
    logger(..._criticalErrors);
    return;

  }
  //check if there is any code to run!
  infiniteFree(code)
    .then(()=> runCode(code, logger))
    .catch(ex => {
      console.log(ex);
      logger(ex);
    });
}

const runCode = function(code, logger){
  const _log = console.log;
  console.log = logger;
  //console.log = logger;
  logger.div.innerHTML = '';
  console.log();//?
  try {
    eval(code);
    console.log = _log;
  }
  catch(ex){
    console.log(ex);
    console.log = _log;
  }
}


const formProcessor = (ev) => {
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  const name = ev.target.files[0].name;
  return getBase64(ev.target.files[0])
    .then(data => ({ name, file: data }));
};

export { formatDate, formProcessor, executeCode, _logger };

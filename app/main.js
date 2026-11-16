const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
function RESPParserInput(input){
    console.log(input);
    let res = input.trim().split('\r\n')
                .map((ele) => ele.toLowerCase())
                .filter((str)=> !(str.startsWith('*') ||str.startsWith('$')));
    console.log(res);
    return res;
}
RESPParserInput('*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n')
// Building RESP output from a string passed to it.
function RESPParserOutput(input){
   return `$${Buffer.byteLength(input)}\r\n${input}\r\n`;
}

//The PX option is used to set a key's expiry time in milliseconds.
//The EX option is used to set a key's expiry time in seconds.

// Uncomment the code below to pass the first stage
const server = net.createServer((connection) => {
  //Object to store key value pairs
  const storedValues = new Map();

  //Listening and responding to clients requests
  connection.on('data',(data)=>{
    console.log(data.toString());
    let inputData = RESPParserInput(data.toString());
    if(inputData[0] === 'echo'){
        let response = RESPParserOutput(inputData[1]);
        console.log(response);
        connection.write(response);
    } else if (inputData[0] === 'ping'){
        connection.write('+PONG\r\n')
    }else if(inputData[0] === 'set'){
        if(inputData.length > 3){
            if(inputData[3].toLowerCase() === 'ex'){
                let ttlInMilliseconds = Date.now() + parseInt(inputData[4]) * 1000;
                storedValues.set(inputData[1], [inputData[2],ttlInMilliseconds]);

            }
            if(inputData[3].toLowerCase() === 'px'){
                let ttlInMilliseconds = Date.now() + parseInt(inputData[4]);
                storedValues.set(inputData[1], [inputData[2], ttlInMilliseconds]);
            }
          
        }else{
            storedValues.set(inputData[1], [inputData[2]]);
        }
        
        connection.write('+OK\r\n')
    }else if(inputData[0] === 'get'){
        let expiry = storedValues.get(inputData[1]);
        if(!storedValues.has(inputData[1]) || expiry[1] && expiry > Date.now()){
            connection.write('$-1\r\n');
        }else{
            let res = storedValues.get(inputData[1]);
            let value = res[0];
            connection.write(RESPParserOutput(value));
        }
    }
  
  })

});

server.listen(6379, "127.0.0.1");



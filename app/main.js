const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
function RESPParserInput(input){
    console.log(input);
    //RESP string example $3\r\nhey\r\n
    //RESP array example *2 \r\n  $5 \r\nhello\r\n $5 \r\n world \r\n
    // if(input.charAt(0) === '*'){
    //     let finalStringArray = [];
    //     let arrayLength = parseInt(input.charAt(1));
    //     let arrayString = input.trim().substring(5);
    //     let arrayOfItems = arrayString.split('$');
    //     console.log(arrayOfItems);
    //     for (let i = 0; i< arrayLength; i++){
    //         let item = arrayOfItems[i].split('\r\n').filter((ele)=>{
    //                 return isNaN(ele);
    //         }).join('');
    //         finalStringArray.push(item)
    //     }
    //     console.log(finalStringArray);
        
    //     return finalStringArray;

    // }
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

// Uncomment the code below to pass the first stage
const server = net.createServer((connection) => {
  //Object to store key value pairs
    storedValues = {};
  //Listening and responding to clients requests
  connection.on('data',(data)=>{
    console.log(data.toString());
    let inputData = RESPParserInput(data.toString());
    if(inputData[0].toLowerCase() === 'echo'){
        let response = RESPParserOutput(inputData[1]);
        console.log(response);
        connection.write(response);
    } else if (inputData[0].toLowerCase() === 'ping'){
        connection.write('+PONG\r\n')
    }else if(inputData[0].toLowerCase() === 'set'){
        let firstKey = inputData[1];
        let firstValue = inputData[2];
        storedValues[firstKey] = firstValue;
        connection.write('+OK\r\n')
    }else if(inputData[0].toLowerCase() === 'get'){
        if(!(inputData[1] in storedValues)){
            connection.write('$-1\r\n');
        }else{
            let res = storedValues[inputData[1]]
            connection.write(RESPParserOutput(res));
        }
    }
  
  })

});

server.listen(6379, "127.0.0.1");



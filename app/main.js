const { log } = require("console");
const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
function RESPParserInput(input){
    console.log(input);
    //RESP string example $3\r\nhey\r\n
    // if(input.charAt(0) === "$"){
    // let slicedString = input.trim().substring(2);
    // let finalString = slicedString.split('\r\n').join('');
    //     console.log(finalString);
    // }
    //RESP array example *2\r\n $5\r\nhello\r\n $5\r\nworld\r\n
    if(input.charAt(0) === '*'){
        let finalStringArray = [];
        let arrayLength = input.charAt(1);
        // console.log(input)
        let arrayString = input.trim().substring(5);
        let arrayOfItems = arrayString.split('$');
        console.log(arrayOfItems);
        for (let i = 0; i< arrayLength; i++){
            let item = arrayOfItems[i].substring(1).split('\r\n').join('');
            finalStringArray.push(item)
        }
        console.log(finalStringArray);
        
        return finalStringArray;

    }
}
// Building RESP output from a string passed to it.
function RESPParserOutput(input){
    let stringLength = input.length;
    console.log('$' + `${stringLength}\\r\\n${input}\\r\\n`)
    let out = '$' + `${stringLength}\\r\\n${input}\\r\\n`
    console.log(out);
    return out;
}

// Uncomment the code below to pass the first stage
const server = net.createServer((connection) => {
  //Listening and responding to clients requests
  connection.on('data',(data)=>{
    //console.log(data.toString());
    let inputData = RESPParserInput(data.toString());
    if(inputData[0].toLowerCase() === 'echo'){
        let response = RESPParserOutput(inputData[1]);
        console.log(response);
        connection.write(response);
    }  
  })

});

server.listen(6379, "127.0.0.1");

// immediately invoked function expression
// IIFI
(function(){
    function start() {
        console.log("Server Started");
    }
    window.addEventListener("load", start);
})();
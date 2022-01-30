import './Home.scss';



const HomePage = () => {
   var timeDash = 200;
   var timeChar = 350;
   var timeWord = 1000;
   var timeMouseDown;
   var timeMouseUp;
   var timeBetweenClicks;

   var output = "Morse Code Output: ";

   function mouseDown(){
      var date = new Date();
      timeMouseDown = date.getTime();
      timeBetweenClicks = timeMouseDown - timeMouseUp;
      if(timeBetweenClicks > timeWord){
         output = output + " ";   
      }
   }

   function mouseUp(){
      var date = new Date();
      timeMouseUp = date.getTime();
      var holdTime = timeMouseUp - timeMouseDown;

      if(holdTime < timeDash){
         output = output + ".";   
      }
      else{
         output = output + "-";
      }
   }

   return (
      <div>
         <h2> {output} </h2>
         <button onMouseDown={mouseDown()} onMouseUp={mouseUp()}>Click me</button>
      </div>
   );
}
 
export default HomePage;
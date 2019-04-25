import { Message } from "src/app/models/message.model";

export class messagesSorter {

     /*
     * Sorted methos that sorts the message array
     */
    public order( mess : Message[] )
    {
       return mess.sort(function(a, b) {
            let date1 =new Date(a.date).getTime();
            let date2 = new Date(b.date).getTime();
            return date2>date1 ? -1 : date2<date1 ? 1 : 0;
        });
    }


   /*
    * This is a sorting method that obtains the minor message
    */
   private findMinor(aux:Message[]){
         let idx=0
         let minor:Message = aux[idx];
         for(let i=0; i<aux.length; i++){
           if(new Date(aux[i].date).getTime()< new Date(minor.date).getTime()){
             idx=i;
             minor= aux[idx];
           }
         }
         return idx;
       }
}

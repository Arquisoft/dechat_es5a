import { message } from "src/app/models/message.model";

export class messagesSorter {

     /*
     * Sorted methos that sorts the message array
     */
    public order( mess : message[] )
    {
       return mess.sort(function(a, b) {
            let date1 =a.date;
            let date2 = b.date;
            return date2>date1 ? -1 : date2<date1 ? 1 : 0;
        });
    }


   /*
    * This is a sorting method that obtains the minor message
    */
   private findMinor(aux:message[]){
         let idx=0
         let minor:message = aux[idx];
         for(let i=0; i<aux.length; i++){
           if(aux[i].date< minor.date){
             idx=i;
             minor= aux[idx];
           }
         }
         return idx;
       }
}
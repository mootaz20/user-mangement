export class task{
    constructor(
         public title: string,
         public descrption: string,
         public assigndTo: string,
         public status: string,
         public priority: string,
         public createdAt: string,
         public key? : string
         ){
       
    }
}
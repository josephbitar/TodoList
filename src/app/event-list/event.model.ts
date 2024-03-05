export class Event {
   public id: string; 
   public title: string;
   public create: Date;
   public done: boolean;
   public description: string;
   public imagePath: string;
   public imageName: string;
   public location: string;

   constructor(id: string);
   constructor(id: string, 
    title?: string, 
    dateTime?: Date, 
    desc?: string, 
    done?: boolean,
    imagePath?: string, 
    imageName?: string, 
    location?: string) {
        this.id = id;
        this.done = done || false;
        this.title = title || '';
        this.create = dateTime || new Date();
        this.description = desc;
        this.imagePath = imagePath;
        this.imageName = imageName;
        this.location = location;
   }
}
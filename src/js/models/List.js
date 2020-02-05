import uniqid from 'uniqid';
export default class list {
    constructor(){
        this.items = []
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index,1);
        
        //remove from storage
        const storage = JSON.parse(localStorage.getItem('shoppingList'));
        const index2 = storage.findIndex(el => el.id === id);
        storage.splice(index2,1);
        return storage;
    }

    updateCount (id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
    

}
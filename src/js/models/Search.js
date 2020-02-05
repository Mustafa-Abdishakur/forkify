import axios from 'axios';
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults() {
        try{
        
        const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
        this.result = res.data.recipes;
        
        
        
        } catch(error) {
            const markUp=`
            <div class="error-pop-up">
                <img src="img/error.jpg" alt="error picture" id="error-img">
             </div>
            `;
            const el = document.querySelector('.container');
            el.insertAdjacentHTML('beforeend',markUp);
        
            
            //alert(error);
        }
        
        }
}













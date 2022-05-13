import {useState , useEffect} from 'react' 
import axios from 'axios';

const Home = () => {
    const [file , setFile] = useState(null)
    const [error , setError] = useState(null)
    const [url , setUrl ] = useState(null)
    const [data , setData] = useState(null)
    const classes = ["airplane" ,  'automobile' , 'berd' , 'cat' , 'deer' ,'dog' , 'frog' , 'horse' , 'ship' , 'truck']

    const types = ['image/png', 'image/jpeg'];
    useEffect(() => {
        if(!file) {
            setUrl(null) ; 

        } 
        else if (file) {
            var binaryData = [];
            binaryData.push(file);
            const  imgUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
            setUrl(imgUrl)
        }
    } , [file])

    const handleChange = (e) => {
        const file = e.target.files[0] ;
        if (file && types.includes(file.type)){
            setFile(file)
            setData(null)
            setError('')
        }else if (file) {
            setFile(null)
            setError('unvalid type')
        }
    }

    const predict =  () => {
        if(file) {
            let formData = new FormData();
            formData.append("file", file);
            axios.post(  'http://localhost:8000/predict/', formData)
            .then(res => setData(res.data) )

        }
    }
    
    const clear  = () => {
        setUrl(null) 
        setFile(null) 
        setError(null)
        setData(null)
    }
    return ( 
        <div>
            <h2 >predict cifar10 dataset </h2> 
            <p>the model can classify those classes</p>
            <div className='items'>
                { classes.map((item)=>{return <ul key={item}>{item} |</ul>})}
            </div>
            <input className='uploder' type= 'file'  onChange = {handleChange} /> 
            <div> 
                {error && <div>{error}</div>}  
                {url &&  <div>
                    <div><img src= { url }  /> </div>   
                    <button  className='button' onClick={predict} >predict</button>
                    <button className='button' onClick={clear}>clear</button>
                </div> }
                
            </div>
            {data && <p className='pred'>{data}</p>}

        </div>
    );
}

export default Home;

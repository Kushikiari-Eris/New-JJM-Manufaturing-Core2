import React, { useState } from 'react'
import { useFinishProductStore } from '../stores/useFinishProductStore';
import { Loader, Upload } from 'lucide-react'

const categories = ["soap", "detergent"];

const CreateFinishProduct = () => {

    const { createFinishedProduct, loading } = useFinishProductStore();
    const [productData, setProductData] = useState({ name: "", category: "", price: "", image: "" });
    const [imagePreview, setImagePreview] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createFinishedProduct(productData); 
            setProductData({ name: "", price: "", category: "", image: "" });
            setImagePreview(null); 
        } catch (error) {
            console.error("Error creating a product:", error);
            alert("Failed to create product. Check the console for details.");
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setProductData({ ...productData, image: reader.result });
            };

            reader.readAsDataURL(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


  return (
    <>
       

    <div className="w-full lg:w-1/3">
        <form className="w-full bg-white border shadow-lg p-6" onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-full px-3 mb-6">
                    <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="category_name">Create a Finish Product</label>
                    <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]" type="text" 
                    name="name" 
                    placeholder="Product Name" 
                    value={productData.name} 
                    onChange={(e) => setProductData({ ...productData, name: e.target.value })}  required />
                </div>
                <div className="w-full px-3 mb-6">
                    <select className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]" id='category'
                    name='category'
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}  required>
                    <option value=''>Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-full px-3 mb-6">
                    <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-[#98c01d]"
                    type="number" 
                    name="price" 
                    placeholder="Price" 
                    value={productData.price} 
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}    required />
                </div>                     
                
                <div className="w-full px-3 mb-8">
                    <label className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white p-6 text-center" htmlFor='image'>
                        {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">Category image</h2>
                            <p className="mt-2 text-gray-500 tracking-wide">Upload or drag & drop your file SVG, PNG, JPG, or GIF.</p>
                        </>
                    )}

                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange}/>
                    </label>
                </div>

                <div className="w-full md:w-full px-3">
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50" disabled={loading}>
                        {loading ? (
                        <>
                          <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Create Finish Product 
                        </>
                      )}
                    </button>
                </div>
                
            </div>
        </form>
    </div>
    </>
  )
}

export default CreateFinishProduct
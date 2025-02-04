import CategoryItem from "../components/CategoryItem"

const categories = [
  { href: "/soap", name: "soap", imageUrl: "/soap.jpg"},
  { href: "/detergent", name: "detergent", imageUrl: "/detergent.jpg"},
]

const HomePage = () => {
  return (
    <>
      
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
            Explore Categories
          </h1>
          <p className="text-center text-xl text-gray-300 mb-12">
            Discover the latest products
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {categories.map(category =>(
              <CategoryItem category={category} key={category.name}/>
            ))}
          </div>
        </div>
    
    </>
  )
}

export default HomePage
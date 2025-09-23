import Link from 'next/link';
import Image from 'next/image';

const CategorySection = () => {
  const categories = [
    {
      title: 'Laptops & Computers',
      items: '142 Items',
      icon: '💻',
      href: '/products?category=technology',
      color: 'bg-blue-50'
    },
    {
      title: 'Pre-school',
      items: '7 Items',
      icon: '🎨',
      href: '/products?category=pre-school',
      color: 'bg-pink-50'
    },
    {
      title: 'Storybooks',
      items: '4 Items',
      icon: '📚',
      href: '/products?category=storybooks',
      color: 'bg-yellow-50'
    },
    {
      title: 'Grade 1',
      items: '42 Items',
      icon: '✏️',
      href: '/products?category=grade-1',
      color: 'bg-red-50'
    },
    {
      title: 'Grade 2',
      items: '149 Items',
      icon: '📝',
      href: '/products?category=grade-2',
      color: 'bg-blue-50'
    },
    {
      title: 'Grade 3',
      items: '41 Items',
      icon: '📖',
      href: '/products?category=grade-3',
      color: 'bg-yellow-50'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop By Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group"
            >
              <div className={`${category.color} p-6 rounded-lg text-center hover:shadow-lg transition-shadow`}>
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600">{category.items}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
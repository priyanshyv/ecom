import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllProductsAsync,
  fetchAllProductsByFiltersAsync,
  selectAllProducts,
  selectTotalItems,
} from '../../product/ProductSlice'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon, StarIcon } from '@heroicons/react/20/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom';
import { ITEMS_PER_PAGE } from '../../../app/constants';

const items = [
  { id: 1, title: 'Back End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
  { id: 2, title: 'Front End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
  { id: 3, title: 'User Interface Designer', department: 'Design', type: 'Full-time', location: 'Remote' },
]

const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order: 'desc', current: false },
  { name: 'Price: Low to High', sort: 'price', order: 'asc', current: false },
  { name: 'Price: High to Low', sort: 'price', order: 'desc', current: false },
];

const filters = [
  {
    id: 'brand',
    name: 'Brands',
    options: [
      { value: 'Essence', label: 'Essence', checked: false },
      { value: 'Glamour Beauty', label: 'Glamour Beauty', checked: false },
      { value: 'Velvet Touch', label: 'Velvet Touch', checked: false },
      { value: 'Chic Cosmetics', label: 'Chic Cosmetics', checked: false },
      { value: 'Nail Couture', label: 'Nail Couture', checked: false },
      { value: 'Calvin Klein', label: 'Calvin Klein', checked: false },
      { value: 'Chanel', label: 'Chanel', checked: false },
      { value: 'Dior', label: 'Dior', checked: false },
      { value: 'Dolce & Gabbana', label: 'Dolce & Gabbana', checked: false },
      { value: 'Gucci', label: 'Gucci', checked: false },
      { value: 'Annibale Colombo', label: 'Annibale Colombo', checked: false },
      { value: 'Furniture Co.', label: 'Furniture Co.', checked: false },
      { value: 'Knoll', label: 'Knoll', checked: false },
      { value: 'Bath Trends', label: 'Bath Trends', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'beauty', label: 'beauty', checked: false },
      { value: 'fragrances', label: 'fragrances', checked: false },
      { value: 'furniture', label: 'furniture', checked: false },
      { value: 'groceries', label: 'groceries', checked: false }
    ],
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const totalItems = useSelector(selectTotalItems);

  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const handleFilter = (e, section, option) => {
    console.log(e.target.checked);
    const newFilter = { ...filter };
    
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      if (newFilter[section.id]) {
        const index = newFilter[section.id].findIndex(
          (el) => el === option.value
        );
        if (index > -1) {
          newFilter[section.id].splice(index, 1);
        }
      }
    }
    console.log({ newFilter });
    setFilter(newFilter);
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    console.log({ sort });
    setSort(sort);
  };

  const handlePage = (page) => {
    console.log({ page });
    setPage(page);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllProductsByFiltersAsync({ filter, sort, pagination }));
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    setPage(1)
  }, [totalItems, sort])

  return (
    <div className="bg-white">
      <div>
        <MobileFilter
          handleFilter={handleFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              All Products
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        {({ focus }) => (
                          <button
                            onClick={(e) => handleSort(e, option)}
                            className={classNames(
                              option.current
                                ? 'font-medium text-gray-900'
                                : 'text-gray-500',
                              focus ? 'bg-gray-100' : '',
                              'block w-full px-4 py-2 text-left text-sm'
                            )}
                          >
                            {option.name}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <DesktopFilter handleFilter={handleFilter} />
              <div className="lg:col-span-3">
              <div>
                <Link to='/admin/product-form' className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white font-semibold shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Add New Product
                </Link>
              </div>
                <ProductGrid products={products} />
              </div>
            </div>
          </section>

          <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            totalItems={totalItems}
          />
        </main>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
}) {
  return (
    <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
        >
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <form className="mt-4 border-t border-gray-200">
            {filters.map((section) => (
              <Disclosure
                as="div"
                key={section.id}
                className="border-t border-gray-200 px-4 py-6"
              >
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">
                      {section.name}
                    </span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon className="h-5 w-5 group-data-[open]:hidden" aria-hidden="true" />
                      <MinusIcon className="h-5 w-5 [.group:not([data-open])_&]:hidden" aria-hidden="true" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-6">
                    {section.options.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center"
                      >
                        <input
                          id={`filter-mobile-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          onChange={(e) =>
                            handleFilter(e, section, option)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-500"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function DesktopFilter({ handleFilter }) {
  return (
    <form className="hidden lg:block">
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">
                {section.name}
              </span>
              <span className="ml-6 flex items-center">
                <PlusIcon className="h-5 w-5 group-data-[open]:hidden" aria-hidden="true" />
                <MinusIcon className="h-5 w-5 [.group:not([data-open])_&]:hidden" aria-hidden="true" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4">
              {section.options.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`filter-${section.id}-${optionIdx}`}
                    name={`${section.id}[]`}
                    defaultValue={option.value}
                    type="checkbox"
                    defaultChecked={option.checked}
                    onChange={(e) => handleFilter(e, section, option)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`filter-${section.id}-${optionIdx}`}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </form>
  );
}

function Pagination({ page, setPage, handlePage, handlePrevPage, handleNextPage, totalItems }) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(page - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {page * ITEMS_PER_PAGE > totalItems
                ? totalItems
                : page * ITEMS_PER_PAGE}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePage(index + 1)}
                className={`relative cursor-pointer z-10 inline-flex items-center ${
                  index + 1 === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                } px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}


function ProductGrid({ products = [] }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {Array.isArray(products) && products.map((product) => (
            <div key={product.id}> {/* move key here */}
              <Link to={`/product-detail/${product.id}`}>
                <div className="group relative border-solid border-2 p-2 border-gray-200">
                  <div className="min-h-60 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        <StarIcon className="w-6 h-6 inline" />
                        <span className="align-bottom">{product.rating}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm block font-medium text-gray-900">
                        ${Math.round(product.price * (1 - product.discountPercentage / 100))}
                      </p>
                      <p className="text-sm block line-through font-medium text-gray-400">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex justify-center my-5">
                <button 
                  className="px-4 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
                >
                  Edit Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// function ProductGrid({ products}) {
//   //console.log(products);
//   return (
//     <div className="bg-white">
//       <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
//         <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
//           {products?.map((product) => (
//             <div>
//             <Link to={`/product-detail/${product.id}`} key={product.id}>
//               <div className="group relative border-solid border-2 p-2 border-gray-200">
//                 <div className="min-h-60 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
//                   <img
//                     src={product.thumbnail}
//                     alt={product.title}
//                     className="h-full w-full object-cover object-center lg:h-full lg:w-full"
//                   />
//                 </div>
//                 <div className="mt-4 flex justify-between">
//                   <div>
//                     <h3 className="text-sm text-gray-700">
//                       <span aria-hidden="true" className="absolute inset-0" />
//                       {product.title}
//                     </h3>
//                     <p className="mt-1 text-sm text-gray-500">
//                       <StarIcon className="w-6 h-6 inline" />
//                       <span className="align-bottom">{product.rating}</span>
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm block font-medium text-gray-900">
//                       $
//                       {Math.round(
//                         product.price * (1 - product.discountPercentage / 100)
//                       )}
//                     </p>
//                     <p className="text-sm block line-through font-medium text-gray-400">
//                       ${product.price}
//                     </p>
//                   </div>
//                 </div>
                
//               </div>
//             </Link>
//             <div className="flex justify-center my-5">
//   <button 
//     className="px-4 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
//   >
//     Edit Product
//   </button>
//             </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
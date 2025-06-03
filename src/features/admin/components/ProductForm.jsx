import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAsync,
} from '../../product/ProductSlice';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue('title', selectedProduct.title);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('discountPercentage', selectedProduct.discountPercentage || 0);
      setValue('thumbnail', selectedProduct.thumbnail);
      setValue('stock', selectedProduct.stock);
      setValue('brand', selectedProduct.brand);
      setValue('category', selectedProduct.category);
      setValue('sku', selectedProduct.sku || '');
      setValue('weight', selectedProduct.weight || 0);
      setValue('tags', selectedProduct.tags?.join(', ') || '');
      setValue('warrantyInformation', selectedProduct.warrantyInformation || 'No warranty');
      setValue('shippingInformation', selectedProduct.shippingInformation || 'Ships in 3-5 business days');
      setValue('availabilityStatus', selectedProduct.availabilityStatus || 'In Stock');
      setValue('returnPolicy', selectedProduct.returnPolicy || 'No returns accepted');
      setValue('minimumOrderQuantity', selectedProduct.minimumOrderQuantity || 1);
      
      // Set dimensions
      setValue('dimensions.width', selectedProduct.dimensions?.width || 0);
      setValue('dimensions.height', selectedProduct.dimensions?.height || 0);
      setValue('dimensions.depth', selectedProduct.dimensions?.depth || 0);
      
      // Set images
      setValue('images', selectedProduct.images?.join(', ') || '');
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = () => {
    const product = {...selectedProduct};
    product.deleted = true;
    dispatch(updateProductAsync(product));
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) => {
        const product = { 
          ...data,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          images: data.images ? data.images.split(',').map(img => img.trim()) : [],
          dimensions: {
            width: +data.dimensions.width || 0,
            height: +data.dimensions.height || 0,
            depth: +data.dimensions.depth || 0
          },
          price: +data.price,
          stock: +data.stock || 0,
          discountPercentage: +data.discountPercentage || 0,
          weight: +data.weight || 0,
          minimumOrderQuantity: +data.minimumOrderQuantity || 1,
          rating: selectedProduct?.rating || 0,
          reviews: selectedProduct?.reviews || [],
          meta: selectedProduct?.meta || {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            barcode: '',
            qrCode: ''
          },
          warrantyInformation: data.warrantyInformation || 'No warranty',
          shippingInformation: data.shippingInformation || 'Ships in 3-5 business days',
          returnPolicy: data.returnPolicy || 'No returns accepted',
          availabilityStatus: data.availabilityStatus || 'In Stock'
        };

        if (params.id) {
          product.id = params.id;
          dispatch(updateProductAsync(product));
          reset();
        } else {
          dispatch(createProductAsync(product));
          reset();
        }
      })}
    >
      <div className="space-y-12 bg-white p-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {params.id ? 'Edit' : 'Add'} Product
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Essential Fields (Required) */}
            <div className="sm:col-span-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Name *
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register('title', {
                    required: 'Product name is required',
                  })}
                  id="title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description *
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  {...register('description', {
                    required: 'Description is required',
                  })}
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="brand"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Brand *
              </label>
              <div className="mt-2">
                <select
                  {...register('brand', {
                    required: 'Brand is required',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">--choose brand--</option>
                  {brands.map((brand) => (
                    <option key={brand.value} value={brand.value}>{brand.label}</option>
                  ))}
                </select>
                {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category *
              </label>
              <div className="mt-2">
                <select
                  {...register('category', {
                    required: 'Category is required',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">--choose category--</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price *
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be greater than 0' },
                  })}
                  id="price"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Stock *
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  {...register('stock', {
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock cannot be negative' },
                  })}
                  id="stock"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Thumbnail URL *
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register('thumbnail', {
                    required: 'Thumbnail URL is required',
                  })}
                  id="thumbnail"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="images"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image URLs (comma separated) *
              </label>
              <div className="mt-2">
                <textarea
                  {...register('images', {
                    required: 'At least one image URL is required',
                  })}
                  id="images"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="sm:col-span-2">
              <label
                htmlFor="discountPercentage"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Discount Percentage
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  {...register('discountPercentage', {
                    min: { value: 0, message: 'Discount cannot be negative' },
                    max: { value: 100, message: 'Discount cannot exceed 100%' },
                  })}
                  id="discountPercentage"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.discountPercentage && <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="sku"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                SKU
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register('sku')}
                  id="sku"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="weight"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Weight (grams)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  {...register('weight', {
                    min: { value: 0, message: 'Weight cannot be negative' },
                  })}
                  id="weight"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="tags"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tags (comma separated)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register('tags')}
                  id="tags"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="width"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Width (cm)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  {...register('dimensions.width', {
                    min: { value: 0, message: 'Width cannot be negative' },
                  })}
                  id="width"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.dimensions?.width && <p className="mt-1 text-sm text-red-600">{errors.dimensions.width.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="height"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Height (cm)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  {...register('dimensions.height', {
                    min: { value: 0, message: 'Height cannot be negative' },
                  })}
                  id="height"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.dimensions?.height && <p className="mt-1 text-sm text-red-600">{errors.dimensions.height.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="depth"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Depth (cm)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  {...register('dimensions.depth', {
                    min: { value: 0, message: 'Depth cannot be negative' },
                  })}
                  id="depth"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.dimensions?.depth && <p className="mt-1 text-sm text-red-600">{errors.dimensions.depth.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="warrantyInformation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Warranty Information
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register('warrantyInformation')}
                  id="warrantyInformation"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="shippingInformation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Shipping Information
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register('shippingInformation')}
                  id="shippingInformation"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="availabilityStatus"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Availability Status
              </label>
              <div className="mt-2">
                <select
                  {...register('availabilityStatus')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-order">Pre-order</option>
                  <option value="Backorder">Backorder</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="minimumOrderQuantity"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Minimum Order Quantity
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  {...register('minimumOrderQuantity', {
                    min: { value: 1, message: 'Minimum order must be at least 1' },
                  })}
                  id="minimumOrderQuantity"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.minimumOrderQuantity && <p className="mt-1 text-sm text-red-600">{errors.minimumOrderQuantity.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="returnPolicy"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Return Policy
              </label>
              <div className="mt-2">
                <textarea
                  {...register('returnPolicy')}
                  id="returnPolicy"
                  rows={2}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>

        {selectedProduct && <button
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Delete
        </button>}

        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
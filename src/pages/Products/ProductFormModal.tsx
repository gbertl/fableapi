import { useController, useForm } from 'react-hook-form';
import React, { useRef, useState } from 'react';

import placeholderImg from '../../assets/images/placeholder.png';
import { Button, Input, Label, Modal } from '../../components';
import { Categories, NewProduct, Sizes } from '../../typings.d';
import { useCreateProduct, useCreateHeroProduct } from '../../hooks';

interface Props {
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentCategory: Categories;
}

interface NewProductForm extends NewProduct {
  heroImageFile?: File | undefined;
}

const ProductFormModal = ({ setIsFormOpen, currentCategory }: Props) => {
  const initialData: NewProductForm = {
    imageFile: undefined,
    name: '',
    collectionName: 'Fable of Klassik',
    category: currentCategory,
    size: Sizes.XS,
    color: '',
    price: 0,
  };

  const { register, handleSubmit, control, reset } = useForm<NewProductForm>({
    defaultValues: initialData,
  });

  const { field: imageFileField } = useController({
    name: 'imageFile',
    control,
  });

  const { field: heroImageFileField } = useController({
    name: 'heroImageFile',
    control,
  });

  const { mutateAsync: createProduct } = useCreateProduct(() => {
    reset();
    setImageFilePreview(placeholderImg);
    setHeroImageFilePreview(placeholderImg);
  });

  const { mutateAsync: createHeroProduct } = useCreateHeroProduct(() => {
    reset();
    setImageFilePreview(placeholderImg);
    setHeroImageFilePreview(placeholderImg);
  });

  const [imageFilePreview, setImageFilePreview] = useState(placeholderImg);
  const [heroImageFilePreview, setHeroImageFilePreview] =
    useState(placeholderImg);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0];
    if (!value) return;

    setImageFilePreview(URL.createObjectURL(value));
    imageFileField.onChange(value);
  };

  const handleHeroImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.files?.[0];
    if (!value) return;

    setHeroImageFilePreview(URL.createObjectURL(value));
    heroImageFileField.onChange(value);
  };

  const onSubmit = async (values: NewProductForm) => {
    const { heroImageFile, category, ...productValues } = values;

    const { data: product } = await createProduct({
      ...productValues,
      category,
    });

    if (heroImageFile) {
      await createHeroProduct({
        product: product._id,
        imageFile: heroImageFile,
      });
    }
  };

  return (
    <Modal setIsOpen={setIsFormOpen}>
      <h2 className="text-2xl mb-10 text-center uppercase text-gray">
        Add new product
      </h2>
      <form className="flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <input
            type="file"
            className="hidden"
            id="imageFile"
            onChange={handleImageFileChange}
          />
          <label htmlFor="imageFile" className="cursor-pointer relative">
            <img src={imageFilePreview} alt="" />

            {imageFilePreview === placeholderImg && (
              <span className="absolute top-[60%] left-1/2 -translate-x-1/2 text-gray">
                Image
              </span>
            )}
          </label>

          <input
            type="file"
            className="hidden"
            id="heroImageFile"
            onChange={handleHeroImageFileChange}
          />
          <label htmlFor="heroImageFile" className="cursor-pointer relative">
            <img src={heroImageFilePreview} alt="" />

            {heroImageFilePreview === placeholderImg && (
              <span className="absolute top-[60%] left-1/2 -translate-x-1/2 text-gray">
                Hero Image
              </span>
            )}
          </label>
        </div>

        <div>
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="Name of the product"
            {...register('name')}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Collection</Label>
            <Input
              type="text"
              placeholder="Name of collection"
              {...register('collectionName')}
            />
          </div>

          <div>
            <Label>Category</Label>
            <select className="w-full p-4" {...register('category')}>
              {Object.values(Categories)?.map((c, idx) => (
                <option value={c} key={idx}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Size</Label>
            <select className="w-full p-4" {...register('size')}>
              {Object.values(Sizes).map((size) => (
                <option value={size} key={size}>
                  {size.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div>
            <Label>Color</Label>
            <Input
              type="text"
              placeholder="Any color or hex"
              {...register('color')}
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              placeholder="Price in pesos"
              {...register('price')}
            />
          </div>
        </div>

        <Button className="mt-3">Submit</Button>
      </form>
    </Modal>
  );
};

export default ProductFormModal;

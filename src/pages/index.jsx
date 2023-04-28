import Head from "next/head";
import {
  Container,
  Heading,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  Spinner,
  FormControl,
  FormLabel,
  VStack,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  useFetchProducts,
  useCreateProduct,
  useDeleteProduct,
  usePatchProduct,
} from "@/features/product/index";

export default function Home() {
  const {
    data,
    isLoading: productIsLoading,
    refetch: refetchProducts,
  } = useFetchProducts({
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Unable to fetch products",
        variant: "left-accent",
        status: "error",
        duration: 3000,
      });
    },
  });

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
      id: 0,
    },
    onSubmit: async () => {
      const { name, price, description, image, id } = formik.values;

      if (id) {
        // Update Product
        editProduct({
          id,
          name,
          price: parseInt(price),
          description,
          image,
        });
        toast({
          title: "Product Edited",
          description: "Product has been edited successfully",
          variant: "left-accent",
          status: "success",
          duration: 3000,
        });
      } else {
        createProduct({
          name,
          price: parseInt(price),
          description,
          image,
        });
        toast({
          title: "Product Created",
          description: "Product has been created successfully",
          variant: "left-accent",
          status: "success",
          duration: 3000,
        });
      }
      formik.setFieldValue("name", "");
      formik.setFieldValue("price", 0);
      formik.setFieldValue("description", "");
      formik.setFieldValue("image", "");
    },
  });

  const { mutate: createProduct, isLoading: createProductIsLoading } =
    useCreateProduct({
      onSuccess: () => {
        refetchProducts();
      },
    });

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: editProduct, isLoading: editProductLoading } =
    usePatchProduct({
      onSuccess: () => {
        refetchProducts();
      },
    });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const confirmationDialog = (productId) => {
    const isConfirm = confirm("Are you sure you want to delete this product?");
    if (isConfirm) {
      deleteProduct(productId);
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
        variant: "left-accent",
        status: "success",
        duration: 3000,
      });
    }
  };

  const onEditClick = (product) => {
    formik.setFieldValue("id", product.id);
    formik.setFieldValue("name", product.name);
    formik.setFieldValue("description", product.description);
    formik.setFieldValue("price", product.price);
    formik.setFieldValue("image", product.image);
  };

  const renderProducts = () => {
    return data?.data.map((product) => {
      return (
        <Tr key={product.id}>
          <Td>{product.id}</Td>
          <Td>{product.name}</Td>
          <Td>{product.price}</Td>
          <Td>{product.description}</Td>
          <Td>{product.image}</Td>
          <Td>
            <Button onClick={() => onEditClick(product)} colorScheme="yellow">
              Edit
            </Button>
          </Td>
          <Td>
            <Button
              onClick={() => confirmationDialog(product.id)}
              colorScheme="red"
            >
              Delete
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <Heading>Hello World</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th>Image</Th>
                <Th colSpan={2}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productIsLoading && <Spinner />}
              {renderProducts()}
            </Tbody>
          </Table>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>ID</FormLabel>
                <input
                  onChange={handleFormInput}
                  name="id"
                  value={formik.values.id}
                />{" "}
              </FormControl>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <input
                  onChange={handleFormInput}
                  name="name"
                  value={formik.values.name}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <input
                  onChange={handleFormInput}
                  name="price"
                  value={formik.values.price}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <input
                  onChange={handleFormInput}
                  name="description"
                  value={formik.values.description}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Image</FormLabel>
                <input
                  onChange={handleFormInput}
                  name="image"
                  value={formik.values.image}
                />
              </FormControl>
              {createProductIsLoading || (editProductLoading && <Spinner />)}
              <Button type="submit">Submit Product</Button>
            </VStack>
          </form>
        </Container>
      </main>
    </>
  );
}

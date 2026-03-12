import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  store: string;
  category: string;
  price: string;
  image: string;
  status: "Approved" | "Pending" | "Rejected";
}

const tableData: Product[] = [
  {
    id: 1,
    name: "Botella Reutilizable",
    store: "EcoTransforma Marketplace",
    category: "Eco Productos",
    price: "$12.00",
    status: "Approved",
    image: "/images/products/product-1.jpg",
  },
  {
    id: 2,
    name: "Bolsa Ecológica",
    store: "Green Store",
    category: "Accesorios",
    price: "$8.00",
    status: "Pending",
    image: "/images/products/product-2.jpg",
  },
  {
    id: 3,
    name: "Cepillo de Bambú",
    store: "BioMarket",
    category: "Hogar",
    price: "$5.00",
    status: "Approved",
    image: "/images/products/product-3.jpg",
  },
  {
    id: 4,
    name: "Kit Zero Waste",
    store: "EcoVida",
    category: "Lifestyle",
    price: "$35.00",
    status: "Rejected",
    image: "/images/products/product-4.jpg",
  },
];

export default function LatestProducts() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Últimos Productos
        </h3>

        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          View all
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>

          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white/90">
              <TableCell isHeader>Product</TableCell>
              <TableCell isHeader>Store</TableCell>
              <TableCell isHeader>Category</TableCell>
              <TableCell isHeader>Price</TableCell>
              <TableCell isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">

            {tableData.map((product) => (
              <TableRow key={product.id}>

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">

                    <Image
                      width={40}
                      height={40}
                      src={product.image}
                      alt={product.name}
                      className="rounded-md"
                    />

                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {product.name}
                    </span>

                  </div>
                </TableCell>

                <TableCell className="text-gray-800 dark:text-white/90">{product.store}</TableCell>

                <TableCell className="text-gray-800 dark:text-white/90">{product.category}</TableCell>

                <TableCell className="text-gray-800 dark:text-white/90">{product.price}</TableCell>

                <TableCell>
                  <Badge
                    size="sm"
                    color={
                      product.status === "Approved"
                        ? "success"
                        : product.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </div>
    </div>
  );
}
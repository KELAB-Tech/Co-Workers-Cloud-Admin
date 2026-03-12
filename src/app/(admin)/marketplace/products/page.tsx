"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";

import {
  getAllProducts,
  activateProduct,
  deactivateProduct,
  toggleFeatured,
} from "@/services/productService";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  mainImageUrl: string;
  status: string;
  featured: boolean;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();

      // si el backend devuelve Page
      if (res.content) {
        setProducts(res.content);
      } else {
        setProducts(res);
      }

    } catch (error) {
      console.error("Error cargando productos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: number) => {
    await activateProduct(id);
    fetchProducts();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateProduct(id);
    fetchProducts();
  };

  const handleFeatured = async (id: number) => {
    await toggleFeatured(id);
    fetchProducts();
  };

  if (loading) {
    return <p className="text-gray-500">Cargando productos...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Productos del Marketplace
          </h2>

          <p className="text-sm text-gray-500">
            Revisa y administra todos los productos del marketplace.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1100px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Product
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Price
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Stock
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Status
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Featured
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <TableRow key={product.id}>
                    {/* Product */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded">
                          <Image
                            width={40}
                            height={40}
                            src={
                              product.mainImageUrl ||
                              "/images/product/product-1.jpg"
                            }
                            alt={product.name}
                          />
                        </div>

                        <span className="block font-medium text-gray-800 dark:text-white text-theme-sm">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                      ${product.price}
                    </TableCell>

                    {/* Stock */}
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                      {product.stock}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          product.status === "ACTIVE"
                            ? "success"
                            : product.status === "PENDING"
                            ? "warning"
                            : "error"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>

                    {/* Featured */}
                    <TableCell className="px-4 py-3 text-theme-sm">
                      {product.featured ? (
                        <span className="text-yellow-500">⭐ Featured</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleActivate(product.id)}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                        >
                          Activate
                        </button>

                        <button
                          onClick={() => handleDeactivate(product.id)}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                        >
                          Deactivate
                        </button>

                        <button
                          onClick={() => handleFeatured(product.id)}
                          className="px-3 py-1 text-xs bg-yellow-500 text-white rounded"
                        >
                          Featured
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
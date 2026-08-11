/**
 * ============================================================================
 * Layboka AI
 * Product Table Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/products/ProductTable.tsx
 *
 * Purpose:
 * - Display AI generated products
 * - Shopify product management
 * - Product status tracking
 *
 * Features:
 * - Product list
 * - Status badge
 * - Price display
 * - AI score
 * - Actions
 *
 * ============================================================================
 */

'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';


// ============================================================================
// TYPES
// ============================================================================

export type ProductStatus =
  | 'published'
  | 'draft'
  | 'generating'
  | 'failed';


export interface ProductItem {

  id: string;

  name: string;

  category: string;

  price: string;

  status: ProductStatus;

  aiScore: number;

  image?: string;

}


export interface ProductTableProps {

  products?: ProductItem[];

  onView?: (
    product: ProductItem
  ) => void;

  onEdit?: (
    product: ProductItem
  ) => void;

}



// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultProducts: ProductItem[] = [

  {
    id: '1',
    name: 'Premium Leather Bag',
    category: 'Fashion',
    price: '$129',
    status: 'published',
    aiScore: 96,
  },


  {
    id: '2',
    name: 'Smart Wireless Headphone',
    category: 'Electronics',
    price: '$89',
    status: 'generating',
    aiScore: 88,
  },


  {
    id: '3',
    name: 'Organic Face Serum',
    category: 'Beauty',
    price: '$49',
    status: 'draft',
    aiScore: 91,
  },


  {
    id: '4',
    name: 'Home Decor Lamp',
    category: 'Lifestyle',
    price: '$79',
    status: 'published',
    aiScore: 94,
  },

];


// ============================================================================
// STATUS HELPERS
// ============================================================================

function getStatusVariant(

  status: ProductStatus

) {


  switch(status) {


    case 'published':

      return 'success';


    case 'generating':

      return 'warning';


    case 'failed':

      return 'danger';


    default:

      return 'neutral';


  }

}



// ============================================================================
// COMPONENT
// ============================================================================

export default function ProductTable({

  products = defaultProducts,

  onView,

  onEdit,

}: ProductTableProps) {


  return (

    <Card

      variant="dark"

      className="mt-6"

    >


      {/* Header */}

      <div

        className="mb-6 flex items-center justify-between"

      >

        <div>

          <h2

            className="text-lg font-semibold text-white"

          >

            AI Products

          </h2>


          <p

            className="mt-1 text-sm text-white/40"

          >

            Manage AI generated Shopify products

          </p>


        </div>



        <Button

          size="sm"

        >

          Generate Product

        </Button>


      </div>



      {/* Desktop Table */}

      <div

        className="hidden overflow-x-auto md:block"

      >

        <table

          className="w-full"

        >

          <thead>

            <tr

              className="border-b border-white/10 text-left"

            >

              <th

                className="pb-3 text-xs font-medium uppercase text-white/40"

              >

                Product

              </th>


              <th

                className="pb-3 text-xs font-medium uppercase text-white/40"

              >

                Category

              </th>


              <th

                className="pb-3 text-xs font-medium uppercase text-white/40"

              >

                Price

              </th>


              <th

                className="pb-3 text-xs font-medium uppercase text-white/40"

              >

                AI Score

              </th>


              <th

                className="pb-3 text-xs font-medium uppercase text-white/40"

              >

                Status

              </th>


              <th

                className="pb-3 text-xs font-medium uppercase text-white/40"

              >

                Action

              </th>


            </tr>

          </thead>



          <tbody>

            {products.map(

              (product) => (

                <tr

                  key={product.id}

                  className="border-b border-white/5"

                >

                  <td

                    className="py-4"

                  >

                    <div

                      className="flex items-center gap-3"

                    >

                      <div

                        className={[

                          'flex',

                          'h-10',

                          'w-10',

                          'items-center',

                          'justify-center',

                          'rounded-xl',

                          'bg-white/5',

                          'text-xs',

                          'text-white/40',

                        ].join(' ')}

                      >

                        IMG

                      </div>


                      <span

                        className="text-sm font-medium text-white"

                      >

                        {product.name}

                      </span>


                    </div>


                  </td>



                  <td

                    className="text-sm text-white/60"

                  >

                    {product.category}

                  </td>



                  <td

                    className="text-sm text-white"

                  >

                    {product.price}

                  </td>



                  <td>

                    <span

                      className="text-sm font-medium text-[#FF3B2F]"

                    >

                      {product.aiScore}%

                    </span>

                  </td>



                  <td>

                    <Badge

                      variant={
                        getStatusVariant(
                          product.status
                        )
                      }

                      size="sm"

                    >

                      {product.status}

                    </Badge>


                  </td>



                  <td>

                    <div

                      className="flex gap-2"

                    >

                      <Button

                        size="sm"

                        variant="ghost"

                        onClick={() =>
                          onView?.(product)
                        }

                      >

                        View

                      </Button>


                      <Button

                        size="sm"

                        variant="ghost"

                        onClick={() =>
                          onEdit?.(product)
                        }

                      >

                        Edit

                      </Button>


                    </div>


                  </td>


                </tr>

              )

            )}

          </tbody>


        </table>


      </div>



      {/* Mobile Cards */}

      <div

        className="space-y-4 md:hidden"

      >

        {products.map(

          (product) => (

            <div

              key={product.id}

              className="rounded-xl border border-white/10 bg-[#0B1710] p-4"

            >

              <h3

                className="font-medium text-white"

              >

                {product.name}

              </h3>


              <p

                className="mt-1 text-sm text-white/50"

              >

                {product.category}

              </p>


              <div

                className="mt-4 flex items-center justify-between"

              >

                <span

                  className="text-white"

                >

                  {product.price}

                </span>


                <Badge

                  variant={
                    getStatusVariant(
                      product.status
                    )
                  }

                  size="sm"

                >

                  {product.status}

                </Badge>


              </div>


            </div>

          )

        )}

      </div>


    </Card>

  );

}

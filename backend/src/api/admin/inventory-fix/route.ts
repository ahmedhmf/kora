import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import linkStockLocationsWorkflow from "../../../workflows/link-stock-locations"

/**
 * Endpoint to manually trigger the linkage between stock locations 
 * and sales channels. This fixes the common issue where products 
 * show as 0 inventory in the Store API even if stock exists.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { result } = await linkStockLocationsWorkflow(req.scope)
      .run()

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to link stock locations",
      error,
    })
  }
}

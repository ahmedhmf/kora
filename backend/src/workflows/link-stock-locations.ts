import {
  createStep,
  createWorkflow,
  WorkflowResponse,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Step to fetch all stock locations
 */
const fetchStockLocationsStep = createStep(
  "fetch-stock-locations",
  async (input, { container }) => {
    const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION)
    const [stockLocations] = await stockLocationModuleService.listAndCount({}, { select: ["id"] })
    return new StepResponse(stockLocations)
  }
)

/**
 * Step to fetch all sales channels
 */
const fetchSalesChannelsStep = createStep(
  "fetch-sales-channels",
  async (input, { container }) => {
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    const [salesChannels] = await salesChannelModuleService.listAndCount({}, { select: ["id"] })
    return new StepResponse(salesChannels)
  }
)

/**
 * Step to link each stock location to each sales channel
 */
const linkStockLocationsStep = createStep(
  "link-stock-locations-step",
  async ({ stockLocations, salesChannels }: { 
    stockLocations: any[], 
    salesChannels: any[] 
  }, { container }) => {
    const linkService = container.resolve(ContainerRegistrationKeys.LINK)
    
    const links = []
    for (const sc of salesChannels) {
      for (const sl of stockLocations) {
        links.push({
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: sc.id,
          },
          [Modules.STOCK_LOCATION]: {
            stock_location_id: sl.id,
          },
        })
      }
    }

    if (links.length > 0) {
      await linkService.create(links)
    }

    return new StepResponse(links.length)
  }
)

/**
 * Main workflow to solve the "quantity problem" by ensuring 
 * stock locations are linked to sales channels.
 */
const linkStockLocationsWorkflow = createWorkflow(
  "link-stock-locations",
  () => {
    const stockLocations = fetchStockLocationsStep()
    const salesChannels = fetchSalesChannelsStep()
    
    const count = linkStockLocationsStep({ stockLocations, salesChannels })
    
    return new WorkflowResponse({
      linkedCount: count,
      message: "Stock locations linked to sales channels successfully"
    })
  }
)

export default linkStockLocationsWorkflow

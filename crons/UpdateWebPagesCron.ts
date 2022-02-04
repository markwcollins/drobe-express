import fastq from 'fastq'
import WebPage from '../services/WebPage'
import Product from '../services/Product'

interface IupdateWebPagesProps {
  from: number
  to: number
}

export default class UpdateWebPagesCron {
  increment = 10
  queue: fastq.queueAsPromised<IupdateWebPagesProps, any>

  constructor() {
    this.queue = fastq.promise(this.updateWebPages, 1)
  }

  async init() {
    const { error, count } = await Product.api.select('*', { count: 'exact', head: true })
    if (!count || error) {
      return console.error(count, error)
    }

    for (let from = 0; from <= count; from += this.increment) {
      let to = from + this.increment
      await this.queue.push({ from, to })
    }
  }

  async updateWebPages ({ from, to }: IupdateWebPagesProps) {
    const { data: products, error } = await Product.selectAndPopulate().range(from, to)
    if (!products || error) {
      return console.error(error)
    }
    
    return await Promise.allSettled(products.map(async product => {
      if (!product.webPage?.price) return// only get data if there is a price alredy attached to the page
      const webPage = new WebPage(product.webPage)
      return await webPage.updateOpenGraphData()
    }))
  }
}
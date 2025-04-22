import supabase from '@/config/supabase.config'
import { CustomError } from './Response & Error Handling/custom-error'

export const downloadPartnerCompanyLogo = async (fileName: string): Promise<Buffer> => {
  try {
    const { data, error } = await supabase
    .storage
    .from(process.env.SUPABASE_PARTNERS_BUCKET_NAME || "eventure-imgs")
    .download(fileName)

    if (error) {
      throw error
    }

    const arrayBuffer = await data.arrayBuffer()

    return Buffer.from(arrayBuffer)

  } catch (err: any) {
    throw new CustomError("Error downloading map thumbnail", 400, err)
  }
}
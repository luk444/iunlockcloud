import { Device } from '../types';

// Model image mapping with credits
const modelImageMap: Record<string, { imageUrl: string; credits: number }> = {
  // iPhone 16 series
  "iphone-16-pro-max": {
    imageUrl: "https://www.apple.com/v/iphone-16/f/images/overview/contrast/iphone_16_pro__fzqmc24ecpui_xlarge.jpg",
    credits: 85
  },
  "iphone-16-pro": {
    imageUrl: "https://www.apple.com/v/iphone-16/f/images/overview/contrast/iphone_16_pro__fzqmc24ecpui_xlarge.jpg",
    credits: 82
  },
  "iphone-16": {
    imageUrl: "https://www.apple.com/v/iphone-16/f/images/overview/contrast/iphone_16__flbknhdndb22_xlarge.jpg",
    // Alternative CDS Assets URL: https://cdsassets.apple.com/content/services/pub/image?productid=301045&size=960x960
    credits: 78
  },
  // iPhone 15 series
  "iphone-15-pro-max": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-pro-max-family.240x240.png",
    credits: 68
  },
  "iphone-15-pro": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-pro-family.240x240.png",
    credits: 65
  },
  "iphone-15-plus": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-plus-family.240x240.png",
    credits: 63
  },
  "iphone-15": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-family.240x240.png",
    credits: 63
  },
  "iphone-14-pro": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone14-pro.240x240.png",
    credits: 58
  },
  "iphone-14-pro-max": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone14-pro-max.240x240.png",
    credits: 60
  },
  "iphone-14-plus": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-14-plus-family.240x240.png",
    credits: 55
  },
  "iphone-14": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-14-family.240x240.png",
    credits: 54
  },
  "iphone-13-pro-max": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-pro-max-colors.240x240.png",
    credits: 50
  },
  "iphone-13-pro": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-pro-colors.240x240.png",
    credits: 48
  },
  "iphone-13-mini": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-mini-colors.240x240.png",
    credits: 45
  },
  "iphone-13": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-colors.240x240.png",
    credits: 45
  },
  "iphone-12-pro": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12pro.240x240.png",
    credits: 42
  },
  "iphone-12-pro-max": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12promax.240x240.png",
    credits: 43
  },
  "iphone-12-mini": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12-mini.240x240.png",
    credits: 39
  },
  "iphone-12": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12.240x240.png",
    credits: 40
  },
  "iphone-11-pro-max": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-11promax.240x240.png",
    credits: 38
  },
  "iphone-11-pro": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-11pro.240x240.png",
    credits: 36
  },
  "iphone-11": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-11.240x240.png",
    credits: 35
  },
  "iphone-xr": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-xr.240x240.png",
    credits: 33
  },
  "iphone-xs": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-xs.240x240.png",
    credits: 33
  },
  "iphone-xs-max": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-xsmax.240x240.png",
    credits: 33
  },
  "iphone-x": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-x.240x240.png",
    credits: 25
  },
  "iphone-se": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-se.240x240.png",
    credits: 25
  },
  "iphone-se-2020": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-se-3rd-gen-colors.240x240.png",
    credits: 35
  },
  "iphone-se-2023": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-se-3rd-gen-colors.240x240.png",
    credits: 50
  },
  "iphone-8": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-8.240x240.png",
    credits: 50
  },
  "iphone-8-plus": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-8plus.240x240.png",
    credits: 25
  },
  "iphone-7": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-7.240x240.png",
    credits: 25
  },
  "iphone-7-plus": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-7plus.240x240.png",
    credits: 25
  },
  "iphone-6": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6.240x240.png",
    credits: 25
  },
  "iphone-6s": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6s.240x240.png",
    credits: 25
  },
  "iphone-6s-plus": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6splus.240x240.png",
    credits: 25
  },
  "iphone-6-plus": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6plus.240x240.png",
    credits: 25
  },
  "iphone-5": {
    imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-5.240x240.png",
    credits: 25
  }
};

interface ApiDeviceResponse {
  device: {
    title: string;
    image_url?: string;
  };
}

export const deviceApiService = {
  async getDeviceByImei(imei: string): Promise<Device | null> {
    try {
      const response = await fetch(`https://cellunlocks.com/api/devices/${imei}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data: ApiDeviceResponse = await response.json();
      
      if (!data.device || !data.device.title) {
        return null;
      }
      
      const deviceTitle = data.device.title;
      const normalizedModelName = deviceTitle.toLowerCase().replace(/\s+/g, '-');
      
      // Add "Apple" prefix to modelName if it doesn't already have it
      const formattedModelName = deviceTitle.toLowerCase().includes('apple') 
        ? deviceTitle 
        : `Apple ${deviceTitle}`;
      
      // Check if we have a mapped model
      const mappedModel = modelImageMap[normalizedModelName];
      
      if (mappedModel) {
        // Use mapped data
        return {
          model: normalizedModelName,
          modelName: formattedModelName,
          imageUrl: mappedModel.imageUrl,
          credits: mappedModel.credits,
          tacs: [imei.substring(0, 8)], // Add the TAC from the IMEI
          modelNumbers: []
        };
      } else {
        // Use API data with default values
        return {
          model: normalizedModelName,
          modelName: formattedModelName,
          imageUrl: data.device.image_url || 'https://via.placeholder.com/240x240?text=iPhone',
          credits: 100, // Default credits
          tacs: [imei.substring(0, 8)],
          modelNumbers: []
        };
      }
    } catch (error) {
      console.error('Error fetching device from API:', error);
      return null;
    }
  },

  // Get device info with image mapping
  getDeviceImageUrl(modelName: string): string | null {
    const normalizedModelName = modelName.toLowerCase().replace(/\s+/g, '-');
    return modelImageMap[normalizedModelName]?.imageUrl || null;
  },

  // Get device credits
  getDeviceCredits(modelName: string): number {
    const normalizedModelName = modelName.toLowerCase().replace(/\s+/g, '-');
    return modelImageMap[normalizedModelName]?.credits || 100;
  },

  // Get all mapped models (for admin reference)
  getAllMappedModels(): Record<string, { imageUrl: string; credits: number }> {
    return modelImageMap;
  }
};
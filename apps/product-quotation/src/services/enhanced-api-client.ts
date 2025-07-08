// Enhanced API Client with Local Storage Fallback
import { ProductQuotationApiClient, Quotation, CreateQuotationDto } from './api-client';
import { LocalStorageService } from './local-storage';

export class EnhancedApiClient extends ProductQuotationApiClient {
  private isBackendAvailable: boolean = true;
  private backendCheckPromise: Promise<boolean> | null = null;

  constructor(baseUrl?: string) {
    super(baseUrl);
    this.checkBackendAvailability();
  }

  private async checkBackendAvailability(): Promise<boolean> {
    if (this.backendCheckPromise) {
      return this.backendCheckPromise;
    }

    this.backendCheckPromise = this.performBackendCheck();
    return this.backendCheckPromise;
  }

  private async performBackendCheck(): Promise<boolean> {
    try {
      // Try to make a simple request to check if backend is available
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000, // 5 second timeout
      } as RequestInit);
      
      this.isBackendAvailable = response.ok;
      console.log(`Backend availability: ${this.isBackendAvailable ? 'Available' : 'Unavailable'}`);
      return this.isBackendAvailable;
    } catch (error) {
      console.log('Backend not available, using local storage fallback');
      this.isBackendAvailable = false;
      return false;
    } finally {
      // Reset the promise after check completes
      setTimeout(() => {
        this.backendCheckPromise = null;
      }, 30000); // Re-check every 30 seconds
    }
  }

  // Override quotation methods to use localStorage fallback
  async getQuotations(search?: string): Promise<Quotation[]> {
    const backendAvailable = await this.checkBackendAvailability();
    
    if (backendAvailable) {
      try {
        return await super.getQuotations(search);
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage:', error);
        this.isBackendAvailable = false;
      }
    }
    
    // Fallback to localStorage
    return LocalStorageService.searchQuotations(search);
  }

  async getQuotation(id: number): Promise<Quotation> {
    const backendAvailable = await this.checkBackendAvailability();
    
    if (backendAvailable) {
      try {
        return await super.getQuotation(id);
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage:', error);
        this.isBackendAvailable = false;
      }
    }
    
    // Fallback to localStorage
    const quotation = LocalStorageService.getQuotation(id);
    if (!quotation) {
      throw new Error(`Quotation with id ${id} not found`);
    }
    return quotation;
  }

  async createQuotation(data: CreateQuotationDto): Promise<Quotation> {
    const backendAvailable = await this.checkBackendAvailability();
    
    if (backendAvailable) {
      try {
        const result = await super.createQuotation(data);
        // Also save to localStorage as backup
        try {
          LocalStorageService.createQuotation(data);
        } catch (localError) {
          console.warn('Failed to backup to localStorage:', localError);
        }
        return result;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage:', error);
        this.isBackendAvailable = false;
      }
    }
    
    // Fallback to localStorage
    return LocalStorageService.createQuotation(data);
  }

  async updateQuotation(id: number, data: Partial<CreateQuotationDto>): Promise<Quotation> {
    const backendAvailable = await this.checkBackendAvailability();
    
    if (backendAvailable) {
      try {
        const result = await super.updateQuotation(id, data);
        // Also update localStorage as backup
        try {
          LocalStorageService.updateQuotation(id, data);
        } catch (localError) {
          console.warn('Failed to backup to localStorage:', localError);
        }
        return result;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage:', error);
        this.isBackendAvailable = false;
      }
    }
    
    // Fallback to localStorage
    const updated = LocalStorageService.updateQuotation(id, data);
    if (!updated) {
      throw new Error(`Quotation with id ${id} not found`);
    }
    return updated;
  }

  async deleteQuotation(id: number): Promise<void> {
    const backendAvailable = await this.checkBackendAvailability();
    
    if (backendAvailable) {
      try {
        await super.deleteQuotation(id);
        // Also delete from localStorage as backup
        try {
          LocalStorageService.deleteQuotation(id);
        } catch (localError) {
          console.warn('Failed to delete from localStorage:', localError);
        }
        return;
      } catch (error) {
        console.warn('Backend request failed, falling back to localStorage:', error);
        this.isBackendAvailable = false;
      }
    }
    
    // Fallback to localStorage
    const success = LocalStorageService.deleteQuotation(id);
    if (!success) {
      throw new Error(`Quotation with id ${id} not found`);
    }
  }

  // Utility methods
  getBackendStatus(): boolean {
    return this.isBackendAvailable;
  }

  async forceBackendCheck(): Promise<boolean> {
    this.backendCheckPromise = null;
    return this.checkBackendAvailability();
  }

  // Data sync methods (for when backend becomes available)
  async syncLocalDataToBackend(): Promise<{ success: number; failed: number; errors: string[] }> {
    const backendAvailable = await this.checkBackendAvailability();
    
    if (!backendAvailable) {
      throw new Error('Backend is not available for sync');
    }

    const localQuotations = LocalStorageService.getQuotations();
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const quotation of localQuotations) {
      try {
        // Try to create in backend (assuming it doesn't exist)
        const createDto: CreateQuotationDto = {
          quotationNumber: quotation.quotationNumber,
          customerName: quotation.customerName,
          companyName: quotation.companyName,
          phoneNumber: quotation.phoneNumber,
          quotationDate: quotation.quotationDate,
          validUntil: quotation.validUntil,
          notes: quotation.notes,
          items: quotation.quotationItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            notes: item.notes,
          })),
        };

        await super.createQuotation(createDto);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to sync quotation ${quotation.quotationNumber}: ${error}`);
      }
    }

    return results;
  }

  // Export/Import functionality
  exportLocalData(): string {
    return LocalStorageService.exportData();
  }

  importLocalData(jsonData: string): boolean {
    return LocalStorageService.importData(jsonData);
  }

  clearLocalData(): void {
    LocalStorageService.clearAllData();
  }
}

// Create and export the enhanced client instance
export const enhancedApiClient = new EnhancedApiClient();
export default enhancedApiClient;
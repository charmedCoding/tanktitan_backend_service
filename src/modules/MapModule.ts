import {Module}  from '@nestjs/common'
import {MapService} from '../services/MapService'

@Module({
    providers: [MapService],
    exports: [MapService]
})

export class MapModule{}

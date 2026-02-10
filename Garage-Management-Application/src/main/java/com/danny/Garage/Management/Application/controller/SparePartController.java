import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.Garage.Management.Application.dto.SparePartDTO;
import com.danny.Garage.Management.Application.entity.SparePart;
import com.danny.Garage.Management.Application.service.SparePartService;

@RestController
@RequestMapping("/SparePart")
public class SparePartController {
    
    private final SparePartService sparePartService;

    @PostMapping("/create")
    public ResponseEntity<SparePartDTO> createSparePart(@RequestBody SparePartDTO sparePartDTO){
        SparePartDTO dto = SparePartService.createSparePart(sparePartDTO);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(dto);
    }
    

    @GetMapping("/get")
    public ResponseEntity<SparePartDTO> getSparePart(){
        
    }
    }
    
    
}

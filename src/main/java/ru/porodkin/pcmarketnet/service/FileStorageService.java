package ru.porodkin.pcmarketnet.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${uploadfile.path}")
    private String uploadPath;

    public String saveFile(MultipartFile file) throws IOException {

        File uploadDir = new File(uploadPath);

        String uuidFile = UUID.randomUUID().toString();
        String resultFileName = uuidFile + "." + file.getOriginalFilename();

        file.transferTo(uploadDir);

        return resultFileName;
    }

//    public FileFromDB getFile(String fileId){
//
//    }
}

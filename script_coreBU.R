#see the gmail shared documents
.jsonfile<-FALSE
.DEBUG<-FALSE
logmsg<-""
pngfile<-""

library(rjson)
library(flowPeaks,lib.loc="/var/www/html/flowPeaks/Rpackages")
#library(flowPeaks,lib.loc="~/Rpackages")

if(.DEBUG){
    args<-c("fromJson.txt")
}else{
    args<-commandArgs(TRUE)
}
#print(args)

if(.jsonfile){
    if(length(args)!=1){
        stop("The R command specification is incorrect\n")
    }
    
    if(!file.exists(args[1])){
        stop("The R json input file does not exist\n")
    }
    input<-fromJSON(file=args[1])
}else{
    input<-fromJSON(args[1])
}

readtablefast<-function(file,ncol=2,sep=","){
    cf<-count.fields(file,sep=",",blank.lines.skip=FALSE,
                     comment.char="")
    if(length(unique(cf))>1){
        logmsg<-"the number of fields are not the same for all rows"
        return(NA)
    }
    header<-scan(file,what="",sep=sep,nlines=1,quiet=TRUE)
    emptyheader<-FALSE
    if ( sum(!is.na(suppressWarnings(as.numeric(header))))==length(header) ){
        ##warning, missing header
        header<-paste("column",1:length(header))
        emptyheader<-TRUE
    }
    if(length(header)<ncol){
        logmsg<-"The number of fields needs to be at least 2"
        return(NA) ##remove empty files
    }
    x<-scan(file,"",sep=sep,skip=1-emptyheader,quiet=TRUE)
    x<-as.numeric(x)
    if(sum(is.na(x))>0){
        logmsg<-"There are entries that are not numerical"
        return(NA) ##remove empty files
    }
    if(length(x)%%length(header)!=0 || length(x)==0){
        logmsg<-"The file format is incorrect"
        return(NA)
    }
    x<-matrix(x,ncol=length(header),byrow=TRUE)
    colnames(x)<-header
    gc(FALSE)
    x
}
is.wholenumber <-function(x, tol = .Machine$double.eps^0.5){
    x<-as.numeric(x)
    abs(x - round(x)) < tol
}

processinput<-function(input){
    input<-input$input
    output<-list()
    output$input<-input
    output$status<-"failure"

    para<-input$params
    checkpara<-function(para){
        if(para$tol<0 | para$tol>1){
            output$message<<-"tol is out of range"
            return(FALSE)
        }else if(para$h0<1 |para$h0>10){
            output$message<<-"h0 is out of range"
            return(FALSE)
        }else if(para$h<1 |para$h>15){
            output$message<<-"h is out of range"
            return(FALSE)
        }
        return(TRUE)
    }

    pngplot<-function(ncol)
    {
        ix<-input$dims$x
        iy<-input$dims$y
        if(!is.wholenumber(ix) |!is.wholenumber(iy)){
            output$message<<-"The dims x or y were not integers"
            return(FALSE)
        }else if(ix<0|ix>ncol|ix<0|iy>ncol){
            output$message<<-"dims x or y is out of range"
            return(FALSE)
        }
        datename<-gsub(" ","_",date(),fixed=TRUE)
        datename<-gsub(":","_",datename,fixed=TRUE)
        pngfile<<-paste("plot_v",ix,"_vs_v",iy,"_",datename,".png",sep="")
        png(file.path(odir,pngfile))
        par(mar=c(5.5,4.5,1.5,1.5))
        plot(fp,idx=c(ix,iy),drawkmeans=FALSE,drawvor=FALSE,drawlab=TRUE)
        dev.off()
        return(TRUE)
    }

    if(!checkpara(para)) return(output)

    idir<-input$data$filedir
    if(!file.exists(idir)){
        output$message<-"the input dir does not exist"
        return(output)
    }
    odir<-input$output$dir

    #browser()
    
    if(!file.exists(odir)){
        output$message<-"the output dir does not exist"
        return(output)
    }
    if(input$mode=="init"){
        ifile<-file.path(idir,input$data$filename)
        if(!file.exists(ifile)){
            output$message<-"The input file does not exist"
            return(output)
        }
        x<-readtablefast(ifile,sep="\t")
        idx<-input$data$fields
        if(sum(!is.wholenumber(idx))>0){
            output$message<-"The fields were not integers"
            return(output)
        }else if(sum(idx<0 |idx>ncol(x))>0){
            output$message<-"The fields are out of range"
            return(output)
        }
        fp<-flowPeaks(x[,idx],tol=para$tol,h0=para$h0,
                      h=para$h)
        if(!pngplot(length(idx))){
            return(output)
        }
    }else{
        fpfile<-file.path(odir,input$refinement$fpfile)
        if(!file.exists(fpfile)){
            output$message<-"fp file does not exist"
            return(output)
        }
        load(fpfile)
        if(!exists("fp")){
            output$message<-"fp file format is bad"
            return(output)
        }
        if(class(fp)!="flowPeaks"){
            output$message<-"fp file format is bad"
            return(output)
        }

        if(input$mode=="refine"){
            ##German should gray all other options except tol, h0, h
            adjust.flowPeaks(fp,tol=para$tol,h0=para$h0,
                             h=para$h)
            ##redo the plot
            if(!pngplot(ncol(fp$x))){
                return(output)
            }
        }else if(input$mode=="plot"){
            ##German should gray all other options except for dims x and y
            if(!pngplot(ncol(fp$x))){
                return(output)
            }
        }else{
            output$message<-"The mode specification is incorroect"
            return(output)
        }
    }
    output$status<-"success"
    if(input$mode!="plot"){
        cid<-fp$peaks.cluster
        mfile<-file.path(odir,"membership.txt")
        fpopt<-fp$options
        header<-c(paste("#The date is",date()),
                  paste("#The original input data file is",ifile),
                  paste("#The merging factor is",fpopt$tol),
                  paste("#The common matrix scaling factor is",fpopt$h0),
                  paste("#The individual matrix scaling factor is",fpopt$h))
        write(header,file=mfile,append=FALSE,sep="\n")
        write(c(colnames(fp$x),"cid"),file=mfile,sep="\t",ncol=ncol(fp$x)+1,append=TRUE)
        write.table(cbind(fp$x,cid),mfile,
                    sep="\t",col.names=FALSE,row.names=FALSE,quote=FALSE,append=TRUE)
        save(fp,ifile,file=file.path(odir,"fpfile.fp"))
        res<-flowPeaks:::getsummarizecluster(fp$x,cid)
        res<-cbind(1:max(cid),res$nc/nrow(fp$x),res$C)
        colnames(res)<-c("cluster id","proportion",
                         colnames(fp$x))
        write.table(res,file.path(odir,"stat.txt"),
                    sep="\t",col.names=TRUE,row.names=FALSE,quote=FALSE)
        output$info<-list(filedir=odir,pngfile=pngfile,fpfile="fpfile.fp",
                          txtfile=list(membership=mfile,
                          statistics="stat.txt"))
    }else{
        output$info<-list(filedir=odir,pngfile=pngfile)
    }
    cols<-c("red","green3","blue","cyan","magenta","yellow","gray")
    Kc<-max(fp$info[,1])
    cols<-rep(cols,ceiling(Kc/length(cols)))
    cols<-cols[1:Kc]
    names(cols)<-1:Kc
    output$info$colorScale<-cols
    output
}
output<-processinput(input)
